# Week 2 — Distributed Tracing

## Table of Contents
| Required Homework | | Homework Challenge|
| :--- | :--- | :--- |
| [Instrument Honeycomb with OTEL](#instrument-honeycomb-with-otel) | | [Instrument Honeycomb for frontend and backend](#instrument-honeycomb-for-frontend-and-backend) |
| [Instrument AWS X-Ray](#instrument-aws-x-ray) | | [Add custom instrumentation to Honeycomb](#add-custom-instrumentation-to-honeycomb) | 
| [Configure custom logger to send to CloudWatch Logs](#configure-custom-logger-to-send-to-cloudwatch-logs) | | [Run custom queries in Honeycomb and save them later](#run-custom-queries-in-honeycomb-and-save-them-later) |
| [Integrate Rollbar and capture error](#integrate-rollbar-and-capture-error) | | [Added custom subsegment annotations in X-Ray](#added-custom-subsegment-annotations-in-xray)|
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

- Add spans and attributes in `home_activities.py` file [commit 038d69f](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/038d69f6f0e34718956546c2f3c25135da8ed9d1)
- Rerun the docker and run a new query in honeycomb
  
  ![image](https://user-images.githubusercontent.com/71366703/221766983-10359f0b-dbcc-453f-a55c-1b2fb916909f.png)
  
### Instrument AWS X-Ray

```sh
gitpod /workspace/aws-bootcamp-cruddur-2023/backend-flask (week2) $ aws xray create-group \
>    --group-name "Cruddur" \
>    --filter-expression "service(\"backend-flask\")"
{
    "Group": {
        "GroupName": "Cruddur",
        "GroupARN": "arn:aws:xray:us-east-1:532819517439:group/Cruddur/JRXLD4GZE4KR6YIQ3JOSRGF4NSVYJZE6SWRQ2SXYPAQZCSH7I5SA",
        "FilterExpression": "service(\"backend-flask\")\n",
        "InsightsConfiguration": {
            "InsightsEnabled": false,
            "NotificationsEnabled": false
        }
    }
}
```
```sh
gitpod /workspace/aws-bootcamp-cruddur-2023 (week2) $ aws xray create-sampling-rule --cli-input-json file://aws/json/xray.json
{
    "SamplingRuleRecord": {
        "SamplingRule": {
            "RuleName": "Cruddur",
            "RuleARN": "arn:aws:xray:us-east-1:532819517439:sampling-rule/Cruddur",
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
:...skipping...
{
    "SamplingRuleRecord": {
        "SamplingRule": {
            "RuleName": "Cruddur",
            "RuleARN": "arn:aws:xray:us-east-1:532819517439:sampling-rule/Cruddur",
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

### Configure custom logger to send to CloudWatch Logs
### Integrate Rollbar and capture error

---

## Homework Challenges

###  Instrument Honeycomb for frontend and backend
### Add custom instrumentation to Honeycomb
### Run custom queries in Honeycomb and save them later
### Added custom subsegment annotations in X-Ray
![image](https://user-images.githubusercontent.com/71366703/221872567-d92f0a38-4e70-4633-a018-2dd40fa8bb86.png)

