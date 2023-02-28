# Week 2 — Distributed Tracing

## Table of Contents
| Required Homework | | Homework Challenge|
| :--- | :--- | :--- |
| [Instrument Honeycomb with OTEL](#instrument-honeycomb-with-otel) | | [Instrument Honeycomb for frontend and backend](#instrument-honeycomb-for-frontend-and-backend) |
| [Instrument AWS X-Ray](#instrument-aws-x-ray) | | [Add custom instrumentation to Honeycomb](#add-custom-instrumentation-to-honeycomb) | 
| [Configure custom logger to send to CloudWatch Logs](#configure-custom-logger-to-send-to-cloudwatch-logs) | | [Run custom queries in Honeycomb and save them later](#run-custom-queries-in-honeycomb-and-save-them-later) |
| [Integrate Rollbar and capture error](#integrate-rollbar-and-capture-error) | | |
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


### Configure custom logger to send to CloudWatch Logs
### Integrate Rollbar and capture error

---

## Homework Challenges

###  Instrument Honeycomb for frontend and backend
### Add custom instrumentation to Honeycomb
### Run custom queries in Honeycomb and save them later
