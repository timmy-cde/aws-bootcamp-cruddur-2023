# Week 10-11 — CloudFormation

## Homework

- [CFN Networking Layer](#cfn-networking-layer)
- [CFN Cluster Layer](#cfn-cluster-layer)
- [CFN Service Layer for Backend](#cfn-service-layer-for-backend)
- [CFN Database Layer (RDS)](#cfn-database-layer-rds)
- [DynamoDB using SAM](#dynamodb-using-sam)
- [CI/CD](#cicd)
- [CFN Static Website Hosting for Frontend](#cfn-static-website-hosting-for-frontend)
- [Challenges](#challenges)
- [Output](#output)

## Final Project Folder Directory Structure for this week

> Folders in Yellow are newly added this week.

```sh
📦aws-bootcamp-cruddur-2023
 ├─🗁 docs
 │  └─🗁 assests
 ├─🗁 aws
 │  ├─📂 cfn
 │  │  ├─📂 cicd
 │  │  │  └─📂 migrations
 │  │  ├─📂 cluster
 │  │  ├─📂 db
 │  │  ├─📂 frontend
 │  │  ├─📂 networking
 │  │  └─📂 service
 │  ├─🗁 json
 │  ├─🗁 lambdas
 │  ├─🗁 policies
 │  ├─🗁 s3
 │  └─🗁 task definitions
 ├─🗁 backend-flask
 │  ├─🗁 bin
 │  ├─🗁 db
 │  │  ├─🗁 migrations
 │  │  └─🗁 sql
 │  │     ├─🗁 activities
 │  │     └─🗁 users
 │  ├─🗁 lib
 │  └─🗁 services
 ├─🗁 bin
 │  ├─🗁 avatar
 │  ├─🗁 backend
 │  ├─📂 cfn
 │  │  └─📂 cruddur-messaging-stream
 │  ├─🗁 cognito
 │  ├─🗁 db
 │  ├─🗁 ddb
 │  ├─🗁 ecr
 │  ├─🗁 frontend
 │  ├─🗁 generate
 │  ├─🗁 lambda-layers
 │  └─🗁 rds
 ├─📂 ddb
 ├─🗁 erb
 ├─🗁 frontend-react-js
 │  ├─🗁 public
 │  └─🗁 src
 │     ├─🗁 components
 │     ├─🗁 lib
 │     └─🗁 pages
 ├─📂 thumbing-serverless-cdk
 │  ├─📂 bin
 │  ├─📂 lib
 │  └─📂 test
 └─🗁 journal
```

## Logical Architectual Diagram for this Week

> Since I am out of free shapes in lucid.app, I transferred my Architectural diagram to draw.io which worked totally fine. You can download my drawio file if you like open it to draw.io [here](https://drive.google.com/file/d/1cDbt5acBkJ8T62bkzMD0a9Am84Ootk-u/view?usp=sharing).

![cruddur](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/50ed468c-8a25-4859-9059-edbbb7096f33)
![cruddur-3](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/f23473d6-49b9-47de-954f-b0bc8440eae9)
![cruddur-2](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/8ce0143f-71d3-4422-803a-008c076fe808)

## Tasks

- Cloudformation CLI Tools to be installed:

  - cfn-lint
    - template validator that focuses more on default rules which mostly catch deployment failures since CloudFormation itself doesn't do enough static analysis before provisioning resources.
    ```sh
        pip install cfn-lint
    ```
  - cfn-guard
    - An open-source general-purpose policy-as-code evaluation tool. It is a template validator that focuses on faster custom rule writing for concise constraints.
    ```sh
        cargo install cfn-guard
    ```
  - cfn-toml
    ```sh
        gem install cfn-toml
    ```
  - aws-sam
    ```sh
        wget https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip
        unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
        sudo ./sam-installation/install
    ```

- S3 Buckets to be created:

  - cfn-artifacts-tim
  - cfn-codepipeline-cruddur-artifacts-tim
  - tmanuel.cloud
  - www.tmanuel.cloud

- ### CFN Networking Layer

  [Template (yaml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/networking/template.yaml) |
  [Config (toml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/networking/config.toml) |
  [Deploy (bash)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/bin/cfn/networking)

  The networking resources of the template are:

  - VPC
  - Internet Gateway
  - VPC Gateway Attachment
  - Route Table
  - Route to IGW
  - 6 Subnets Explicitly Associated to Route Table
    - 3 Public Subnets (from 1 to 3)
    - 3 Private Subnets (from 1 to 3)

  The outputs of the template are:

  - VPC ID
  - VPC CIDR Block
  - Subnet CIDR Blocks
  - Public Subnet IDs
  - Private Subnet IDs
  - Availability Zones

  The config.toml will pass the parameters to the bash script using cfn-toml cli for aws cloudformation cli:

  - S3 bucket name (cfn-artifacts-tim)
  - region (us-east-1)
  - stack name (CrdNet)

- ### CFN Cluster Layer

  [Template (yaml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/cluster/template.yaml) |
  [Config (toml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/cluster/config.toml) |
  [Deploy (bash)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/bin/cfn/cluster)

  The cluster resources of the template are:

  - ECS Fargate Cluster
  - Application Load Balancer (ALB)
    - ipv4 only
    - internet facing
    - certificate attached from Amazon Certification Manager
  - HTTPS Listener
    - send naked domain to frontend Target Group
  - HTTP Listener (redirects to HTTPS internet)
  - Api ALB Listener Rule
    - sets listener to HTTPS Listener
    - sets api subdomain to backend Target Group
  - ALB Security Group
  - Service Security Group
  - Backend Target Group
  - Frontend Target Group

  The outputs of the template are:

  - Cluster Name
  - Service SG ID
  - ALB SG ID
  - Frontend TG ARN
  - Backend TG ARN

  The config.toml will pass the parameters to the bash script using cfn-toml cli for aws cloudformation cli:

  - S3 bucket name (cfn-artifacts-tim)
  - region (us-east-1)
  - stack name (CrdCluster)
  - Certificate Arn
  - NetworkingStack (CrdNet)

- ### CFN Service Layer for Backend

  [Template (yaml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/service/template.yaml) |
  [Config (toml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/service/config.toml) |
  [Deploy (bash)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/bin/cfn/service)

  The backend service resources of the template are:

  - Fargate Service
  - Task Definition
  - Execution Role
  - Task Role

  The outputs of the template are:

  - Service Name

  The config.toml will pass the parameters to the bash script using cfn-toml cli for aws cloudformation cli:

  - S3 bucket name (cfn-artifacts-tim)
  - region (us-east-1)
  - stack name (CrdSrvBackendFlask)

- ### CFN Database Layer (RDS)

  [Template (yaml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/db/template.yaml) |
  [Config (toml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/db/config.toml) |
  [Deploy (bash)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/bin/cfn/db)

  The Postgres database resources of the template are:

  - RDS Postgres SG
    - the VPC Id is imported at the Networking Stack
    - the Source Security GroupId is imported at the Cluster Stack
    - the port is configured to be 5432
  - DB Subnet Group
  - Database
    - DB Instance Class used is `db.t4g.micro`
    - DB Instance Identifier is `cruddur-instance`
    - Engine Version is `15.2`

  The config.toml will pass the parameters to the bash script using cfn-toml cli for aws cloudformation cli:

  - S3 bucket name (cfn-artifacts-tim)
  - region (us-east-1)
  - stack name (CrdDb)
  - NetworkingStack (CrdNet)
  - ClusterStack (CrdCluster)
  - MasterUsername (cruddurroot)

  Before running the bash script, first set a DB_PASSWORD env variable in gitpod to be passed in the `--parameter-overrides` in the aws cli.
  After successfully deploying the cfn template, update the `CONNECTION_URL` of the rds database in the Parameter Store.

- ### DynamoDB using SAM

  [Template (yaml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/ddb/template.yaml) |
  [Cruddur Messaging Stream Lambda](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/ddb/cruddur-messaging-stream/lambda_function.py) |
  [Config (toml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/ddb/config.toml) |
  [Build (bash)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/ddb/build) |
  [Package (bash)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/ddb/package) |
  [Deploy (bash)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/ddb/deploy)

  Since we are using sam to deploy the dynamodb and the lambda function, we need to first build and package the dynamodb stream to a zip where it will be uploaded in the `cfn-artifacts-tim` s3 bucket before deploying the yaml template.

  The DynamoDB resources of the template are:

  - Dynamo DB Table
  - Process Dynamo DB Stream
  - Lambda Log Group
  - Lambda Log Stream
  - Execution Role

  The config.toml will pass the config file to the bash script using aws-sam cli with its build, package and deploy parameters set to region as `us-east-1`.

- ### CI/CD

  [CodeBuild (yaml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/cicd/nested/codebuild.yaml) |
  [Template (yaml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/cicd/template.yaml) |
  [Config (toml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/cicd/config.toml) |
  [Deploy (bash)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/bin/cfn/cicd)

  Here, we used a nested cfn stack, where the codebuild template is nested inside the cicd template.

  CodeBuild resources:

  - CodeBuild
  - CodeBuild Role
    CodeBuild Output:
  - CodeBuild Project Name

  CICD template resources:

  - CodeBuild Bake Image Stack (this is where the codebuild template is referenced)
  - CodeStar Connection
  - Pipeline
  - CodePipeline Role

  The config.toml will pass the parameters to the bash script using cfn-toml cli for aws cloudformation cli:

  - S3 bucket name (cfn-artifacts-tim)
  - region (us-east-1)
  - stack name (CrdCicd)
  - ServiceStack (CrdSrvBackendFlask)
  - ClusterStack (CrdCluster)
  - GithubBranch (prod)
  - GithubRepo (timmy-cde/aws-bootcamp-cruddur-2023)
  - ArtifactBucketName (cfn-codepipeline-cruddur-artifacts-tim)

  Since it is nested, the template is first packaged and uploaded to `cfn-artifacts-tim` s3 bucket before the template is deployed to cfn.
  The pipeline will result to failed, since the Github connection in the codestar is still pending, so we need to manually validate the connection.

- ### CFN Static Website Hosting for Frontend

  [Template (yaml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/frontend/template.yaml) |
  [Config (toml)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/aws/cfn/frontend/config.toml) |
  [Deploy (bash)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-10/bin/cfn/frontend)

  The Frontend resources of the template are:

  - Root Bucket Policy
  - Www Bucket (this will redirect to root domain)
  - Root Bucket (set to be publicly accessible)
  - Root Bucket Domain
  - Www Bucket Domain
  - Distribution

  > `Z2FDTNDATAQYW2` is always the hosted zone ID when you create an alias record that routes traffic to a CloudFront distribution.

  The config.toml will pass the parameters to the bash script using cfn-toml cli for aws cloudformation cli:

  - S3 bucket name (cfn-artifacts-tim)
  - region (us-east-1)
  - stack name (CrdFrontend)
  - CertificateArn
  - WwwBucketName (www.tmanuel.cloud)
  - RootBucketName (tmanuel.cloud)

## Challenges

- Namespace Name

  - Instead of deleting the existing `cruddur` namespace, I set a new namespace name called `cruddur-2` in the cluster and backend service yaml templates.

- Unable to run ECS Backend Task
  - I encountered the same error code when we did run the backend task using ClickOps which is Error Code 137 where in ClickOps, I resolved that by terminating all the tasks running, but in the CFN, I had to change my cpu from `256` to `512` and memory from `512` to `1024` in the Task Definition resource of the backend service template.

## Output

S3 Buckets
![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/a28e70b1-786f-4436-a250-08abc952f762)
![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/6d89482e-7c8b-4791-b961-9e0c14305f0f)

ECS
![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/0c2e22f9-761d-4e94-b775-16e4f4ce2f67)
![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/148c25e0-7a46-4226-be5b-695162eed674)

RDS
![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/8efaf0f6-9569-4d02-9c05-c551ba42ef81)

DynamoDB
![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/365db412-8f0e-4503-a0f4-fa5282e4de7e)

CodeBuild
![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/2c125e4b-8868-411d-a36e-90112f5f26b6)

CodePipeline
![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/0dac72e5-4846-4406-a9b9-813ad96eff61)
![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/aeafe081-3e22-438a-bd74-efbfd775347e)

CFN
![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/e8116679-4d41-4103-80d3-3540cb57a0e3)
