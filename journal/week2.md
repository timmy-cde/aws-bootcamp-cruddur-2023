# Week 2 — Distributed Tracing

## Table of Contents
| Required Homework | | Homework Challenge|
| :--- | :--- | :--- |
| [Instrument Honeycomb with OTEL](#instrument-honeycomb-with-otel) | | [Instrument Honeycomb for frontend and backend](#instrument-honeycomb-for-frontend-and-backend) |
| [Instrument AWS X-Ray](#instrument-aws-x-ray) | | [Add custom instrumentation to Honeycomb](#add-custom-instrumentation-to-honeycomb) | 
| [Configure custom logger to send to CloudWatch Logs](#configure-custom-logger-to-send-to-cloudwatch-logs) | | [Run custom queries in Honeycomb and save them later](#run-custom-queries-in-honeycomb-and-save-them-later) |
| [Integrate Rollbar and capture error](#integrate-rollbar-and-capture-error) | | [Added custom subsegment annotations in X-Ray](#added-custom-subsegment-annotations-in-x-ray)|
---

## Required Homework

### Instrument Honeycomb with OTEL
- Add a new test environment in Honeycomb named **bootcamp**
 
  ![image](https://user-images.githubusercontent.com/71366703/221765130-006bb46a-7144-44b6-93d8-e1456d3d1c62.png)
- Copy the bootcamp environment api key then set Honeycomb variables and add dependencies for OTEL [(commit b792b13)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/b792b13f5e23da76a6fc89f8a818ef7d95e6afdf)
  ```sh
  # on terminal
  
  export HONEYCOMB_API_KEY="<KEY_HERE>"
  gp env HONEYCOMB_API_KEY="<KEY_HERE>"
  ```
  ```Dockerfile
  # inside docker-compose file
  
  OTEL_EXPORTER_OTLP_ENDPOINT: "https://api.honeycomb.io"
  OTEL_EXPORTER_OTLP_HEADERS: "x-honeycomb-team=${HONEYCOMB_API_KEY}"
  OTEL_SERVICE_NAME: "backend-flask"
  ```
  ```sh
  # inside requirements.txt
  
  opentelemetry-api
  opentelemetry-sdk
  opentelemetry-exporter-otlp-proto-http
  opentelemetry-instrumentation-flask
  opentelemetry-instrumentation-requests
  ```
- Install the dependencies using the command `pip install -r requirements.txt`
- Add Honeycomb to the backend `app.py` file [(commit 0ed729a)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/0ed729a8a2971b879edae05f13d5c85276b33f6a)
- Run the `docker compose up` command and see the dataset in Honeycomb
  
  ![image](https://user-images.githubusercontent.com/71366703/221764994-688f55a0-3142-4da8-8f59-f5b40b2f4570.png)
  ![image](https://user-images.githubusercontent.com/71366703/221767333-d4a01f19-c25f-49d4-995e-9ab75818eba1.png)

- Add spans and attributes in `home_activities.py` file [(commit 038d69f)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/038d69f6f0e34718956546c2f3c25135da8ed9d1)
- Rerun the docker and run a new query in honeycomb
  
  ![image](https://user-images.githubusercontent.com/71366703/221766983-10359f0b-dbcc-453f-a55c-1b2fb916909f.png)
  ![image](https://user-images.githubusercontent.com/71366703/222111926-431d946f-6c44-4d73-a44d-273d4dd06f4e.png)
  
### Instrument AWS X-Ray
- Added X-Ray SDK to `requirements.txt`, sample (xray.json) and code in `app.py` file [(commit 827d657)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/827d65726eed98dfd00d4ce407e918acb10d2ed6)
- Added X-Ray env variable in backend-flask part of the `docker-compose.yml` file and the X-Ray daemon image [(commit 69f7965)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/69f796504e05313380644659c55a93db409e8619)
- Create an x-ray group
 
  ```sh
  gitpod /workspace/aws-bootcamp-cruddur-2023/backend-flask (week2) $ aws xray create-group \
  >    --group-name "Cruddur" \
  >    --filter-expression "service(\"backend-flask\")"
  {
      "Group": {
          "GroupName": "Cruddur",
          "GroupARN": "arn:aws:xray:us-east-1:XXXXXXXX7439:group/Cruddur/JRXLD4GZE4KR6YIQ3JOSRGF4NSVYJZE6SWRQ2SXYPAQZCSH7I5SA",
          "FilterExpression": "service(\"backend-flask\")\n",
          "InsightsConfiguration": {
              "InsightsEnabled": false,
              "NotificationsEnabled": false
          }
      }
  }
  ```
  ![image](https://user-images.githubusercontent.com/71366703/222108347-e867c8b1-160b-4355-ba26-53ca23efb894.png)
 - Create Sampling Rule

    ```sh
    gitpod /workspace/aws-bootcamp-cruddur-2023 (week2) $ aws xray create-sampling-rule --cli-input-json file://aws/json/xray.json
    {
        "SamplingRuleRecord": {
            "SamplingRule": {
                "RuleName": "Cruddur",
                "RuleARN": "arn:aws:xray:us-east-1:XXXXXXXX7439:sampling-rule/Cruddur",
                "ResourceARN": "*",
                "Priority": 9000,
                "FixedRate": 0.1,
                "ReservoirSize": 5,
                "ServiceName": "blackend-flask",
                "ServiceType": "*",
                "Host": "*",
                "HTTPMethod": "*",
                "URLPath": "*",
                "Version": 1,
                "Attributes": {}
            },
            "CreatedAt": "2023-02-28T09:09:46+00:00",
            "ModifiedAt": "2023-02-28T09:09:46+00:00"
        }
    }
    ```
    ![image](https://user-images.githubusercontent.com/71366703/222108591-c9c8e212-73e7-4126-beca-c8acc75dd042.png)

  - Run the docker compose file and see the logs in x-ray container and in the aws console.

    ```sh
     *  Executing task: docker logs --tail 1000 -f f665b79290f3c35f47d5c6842ee9361af71a23f21bf99791c34ac846b1945d6d 

    2023-02-28T09:22:50Z [Info] Initializing AWS X-Ray daemon 3.3.6
    2023-02-28T09:22:50Z [Info] Using buffer memory limit of 643 MB
    2023-02-28T09:22:50Z [Info] 10288 segment buffers allocated
    2023-02-28T09:22:50Z [Info] Using region: us-east-1
    2023-02-28T09:22:59Z [Error] Get instance id metadata failed: RequestError: send request failed
    caused by: Get "http://169.254.169.254/latest/meta-data/instance-id": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
    2023-02-28T09:22:59Z [Info] HTTP Proxy server using X-Ray Endpoint : https://xray.us-east-1.amazonaws.com
    2023-02-28T09:22:59Z [Info] Starting proxy http server on 0.0.0.0:2000
    2023-02-28T09:23:52Z [Info] Successfully sent batch of 1 segments (0.404 seconds)
    2023-02-28T09:24:01Z [Info] Successfully sent batch of 1 segments (0.066 seconds)
    2023-02-28T09:24:11Z [Info] Successfully sent batch of 1 segments (0.082 seconds)
    ```
    ![image](https://user-images.githubusercontent.com/71366703/222110693-24644109-c150-4eb1-ae42-8edf502541f0.png)


### Configure custom logger to send to CloudWatch Logs
- Added Watchtower dependency in `requirements.txt` file, added loggers in `app.py`, `home_activities.py` and `user_activities.py` [(commit 2173250)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/21732506634a3e948da251c9a67d0c20ca0de692)
- Run the doccker-compose file and see the logs in CloudWatch.
  ![image](https://user-images.githubusercontent.com/71366703/221897217-10652f0a-b329-4890-bb4e-8a756876c6ce.png)

### Integrate Rollbar and capture error
- Added rollbar dependencies on `requirements.txt`, added rollbar on `app.py`, added environment variable for **ROLLBAR_ACCESS_TOKEN** in gitpod env and in `docker-compose.yml` file [(commit ebfc358)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/ebfc358450e609bea2bc92d3f4576e36e0af6739?diff=split)
- First tested the error using the `rollbar/test` endpoint

  ![image](https://user-images.githubusercontent.com/71366703/222164526-e87f213d-c533-4564-ba6a-b92fa1de84ce.png)
- Tested the error by removing `return` in `home_activities.py` file.
  
  ![image](https://user-images.githubusercontent.com/71366703/222164893-f7482fff-b318-45b1-b855-a623275fee9f.png)
  ![image](https://user-images.githubusercontent.com/71366703/222164714-7f962e72-8aad-481a-8586-dba80d15fb0a.png)

---

## Homework Challenges

###  Instrument Honeycomb for frontend and backend
- Install honeycomb dependencies on the frontend
  ```sh
  npm install --save \
      @opentelemetry/api \
      @opentelemetry/sdk-trace-web \
      @opentelemetry/exporter-trace-otlp-http \
      @opentelemetry/context-zone \
      @opentelemetry/instrumentation \
      @opentelemetry/instrumentation-xml-http-request \
      @opentelemetry/instrumentation-fetch \
      @opentelemetry/instrumentation-document-load \
      @opentelemetry/instrumentation-user-interaction \
      @opentelemetry/instrumentation-long-task
  ```
- Create `tracing.js` file inside the `frontend-react-js/src` for the otel initialization
  ```js
  import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
  import { WebTracerProvider, BatchSpanProcessor } from '@opentelemetry/sdk-trace-web';
  import { ZoneContextManager } from '@opentelemetry/context-zone';
  import { Resource }  from '@opentelemetry/resources';
  import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
  import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
  import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
  import { registerInstrumentations } from '@opentelemetry/instrumentation';
  import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
  import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';

  const exporter = new OTLPTraceExporter({
    url: `${process.env.REACT_APP_OTEL_COLLECTOR_URL}/v1/traces`,
  });

  const provider = new WebTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'frontend',
    }),
  });

  provider.addSpanProcessor(new BatchSpanProcessor(exporter));
  provider.register({
    contextManager: new ZoneContextManager()
  });

  registerInstrumentations({
    instrumentations: [
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: [
          new RegExp(`${process.env.REACT_APP_BACKEND_URL}`, 'g')
          // /^https:\/\/4567-[a-z0-9]+-[a-z0-9]+-[a-z0-9].+[a-z0-9]+\.gitpod\.io\//g
        ]
      }),
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [
          new RegExp(`${process.env.REACT_APP_BACKEND_URL}`, 'g')
          // /^https:\/\/4567-[a-z0-9]+-[a-z0-9]+-[a-z0-9].+[a-z0-9]+\.gitpod\.io\//g
        ]
      }),
      new DocumentLoadInstrumentation(),
      // new UserInteractionInstrumentation(),
    ],
  });
  ```
- Create `otel-collector-config.yaml` for the configuration of the otel
  ```yaml
  receivers:
  otlp:
    protocols:
      http: # port 4318
        # include_metadata: true
        cors:
          allowed_origins:
            - "${REACT_APP_FRONTEND_URL_HTTP}"
            - "${REACT_APP_FRONTEND_URL_HTTPS}"
            # - "https://3000-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
            # - "http://3000-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
          allowed_headers:
            - '*'

   processors:
     batch:

   exporters:
     otlp:
       endpoint: "api.honeycomb.io:443"
       headers:
         "x-honeycomb-team": "${HONEYCOMB_API_KEY}"
     logging:
       loglevel: debug

   service:
     pipelines:
       traces:
         receivers: [otlp]
         processors: [batch]
         exporters: [otlp]
  ```
- In the backend, add `traceparent` in the `allowed_headers` of the `app.py` file to connect the backend and frontend tracing requests
  ```py
  cors = CORS(
    app,
    resources={r"/api/*": {"origins": origins}},
    expose_headers="location,link",
    allow_headers=["content-type", "if-modified-since", "traceparent"],
    methods="OPTIONS,GET,HEAD,POST"
  )
  ```
- Add the otel image in the `docker-compose.yml` file
  ```yml
  otel-collector:
    environment:
      REACT_APP_FRONTEND_URL_HTTP: "http://3000-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
      REACT_APP_FRONTEND_URL_HTTPS: "https://3000-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
      HONEYCOMB_API_KEY: "${HONEYCOMB_API_KEY}"
    image: otel/opentelemetry-collector
    command: [--config=/etc/otel-collector-config.yaml]
    volumes:
      - ./otel-collector-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - 4318:4318 # OTLP http receive
  ```
> I struggled to debug the honeycomb on frontend. First was my otel request url became `${FRONTEND_URL}/undefined/v1/traces` instead of the `${OTEL_COLLECTOR}/v1/traces`, I honestly do not know how I resolved it at this point, but at some point of my debugging it got the correct request url for the otel collector. My next bug was resolving the cors error for the otel_collector which I later resolved by unlocking the otel_collector port `4318` in the ports tab.
- We can now see the tracing works!
  ![image](https://user-images.githubusercontent.com/71366703/223167408-ec5c8b07-c285-408d-af83-05447bb36949.png)
- Set the port `4318` to be automatically unlock when the docker runs in `.gitpod.yml` file
  ```yml
  ports:
  - name: otel-http-exporter
  port: 4318
  visibility: public
  ```

### Add custom instrumentation to Honeycomb
- Added the attributes user and message in `/api/activities/home` endpoint [(commit cd3ffa3)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/cd3ffa3c77e6609cb1d8dc9ba2767c27ab61b1ec)
  
  ![image](https://user-images.githubusercontent.com/71366703/222642934-f2e15be9-dbad-40d3-8163-e7db57b566c5.png)

### Run custom queries in Honeycomb and save them later
- Run queries and saved them to the `backed queries` board.
  
  ![image](https://user-images.githubusercontent.com/71366703/222646173-309a0909-c9fa-4775-834b-43e44138660c.png)
  ![image](https://user-images.githubusercontent.com/71366703/222644695-db3a1ced-0ff6-4082-ab6d-922e5432140d.png)
### Added custom subsegment annotations in X-Ray
- Using `xray_recorder.begin_subsegment` and `xray_recorder.end_subsegment` only [(commit 2916e8b)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/2916e8bc9aeed93f0ada47107d39477a7ec880af)

  ![image](https://user-images.githubusercontent.com/71366703/222373093-4cb3aebb-ef3f-46cd-a3df-10920311335d.png)
- Using Andrew's way (adding of `@xray_recorder.capture` on app.py) [(commit 5805172)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/5805172a42a6da9d9f7b6cc8d5be67205c8e3815)
  
  ![image](https://user-images.githubusercontent.com/71366703/222904340-7d2e27bf-a5f8-48f6-9358-12149ad7b10f.png)



