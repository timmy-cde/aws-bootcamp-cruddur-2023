# Week 9 — CI/CD with CodePipeline, CodeBuild and CodeDeploy

## Required Homework

- [Configure CodeBuild](#codebuild-configuration)
- [Configure CodePipeline](#codepipeline-configuration)

## Tasks

- ### CodeBuild Configuration:

  - In the github repo, create a new repository named `prod`. This will be the source of code in the CodeBuild.
  - Create a `buildspec.yml` file inside the `backend-flask` directory of the `week-9` branch.
  - In the CodeBuild, create a new build project:

    - Project name: cruddur-backend-flask-bake-image
      - Enable build badge
      - Enable Restrict number of concurrent builds this project can start
    - Source Provider: Github
      - Choose Respository in my Github Account
      - Connect to your Github Account
      - Select the Github repository for the `aws-bootcamp-cruddur-2023`
      - Source version: prod
    - Enable Webhook
      - Build type: Single build
      - Event type: PULL_REQUEST_MERGED
    - Select Managed image
      - Operating system: Amazon Linux 2
      - Runtime(s): Standard
      - Image: aws/codebuild/amazonlinux2-x86_64-standard:4.0
        > Always choose the latest version
      - Environment type: Linux
    - Select New Service role with the Role name: `codebuild-cruddur-backend-flask-bake-image-service-role`
    - Select Use a buildspec file
      - Buildspec name: backend-flask/buildspec.yml
    - Select No artifacts
    - Select CloudWatch Logs
      - Group name: /cruddur/build/backend-flask
      - Stream name: backend-flask

    Contrary to what Andrew did to the permissions, when running the CodeBuild, my logs shows that I cannot login to ecr nor pull anything in it, so I added this [permission](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-9/aws/json/ecr-permissions.json) to the following:

    - I added an inline policy in CodeBuild Service Role
    - I added permission to the `backend-flask` ECR repository

  - Copy the Build badge and paste it to `main` and `week-9` branch
  - Push `week-9` changes to github repo and merge the `week-9` branch to `prod` branch

- ### CodePipeline Configuration
  - Pipeline name: cruddur-backend-fargate
  - Select a New service role
    - Role name: cruddur-backend-fargate
  - Source provider: Github (version 2)
    - In Connection, since we already connected to github earlier, we can select our existing connection to the github repo.
    - Choose the repository name
    - Select the `prod` branch
  - Skip the build stage (we will add it later)
  - Deploy provider: Amazon ECS (not the Amazon ECS with Blue/Green)
    - Choose your region
    - Cluster name: cruddur
    - Service name: backend-flask
  - Create the pipeline
  - Edit the CodePipeline
    - Add a stage between the Source and Deploy with the name `build`
      - Add action group
      - Action name: bake
      - Action provider: AWS CodeBuild
      - Choose your region
      - Input Artifact: SourceArtifact
      - Select the `cruddur-backend-flask-back-image` Project name
      - Build type: Single build
      - Output artifacts: ImageDefinition
    - Edit the Deploy
      - Select the Input artifacts as the `ImageDefinition`

## Troubleshooting

- `AccountLimitExceeded` error in CodePipeline when I merge my repo, which will trigger the CodeBuild and CodePipeline build stage at the same time. After looking on the internet and in the discord for solutions, they said that the only solution is to open a support case in AWS Support to add additional Concurrent Builds.
- Running the backend service task on the ecs results to `@app.before_first_request` error where it cannot find the `before_first_request` function on `app`, so the quick and dirty way to resolve this is to comment this line on the `app.py` file. It won't have any visible changes on running the service since this `@app.before_first_request` is configured for rollback
- `Exit code 137` on the backend service task. Upon searching what this particular error code means, I found this two probabilities:
  - Health Check fails -> My tasks exited even if they are healthy so this is not the problem for me.
  - Memory Limit Reached based on the defined memory on the Container Definition -> This is probably my problem since apparently when the CodePipeline is executed, my old backend task did not terminate even though I set the Desired Tasks to 1 only and in turn ate all of the allocated memory for the service. So I stopped all the running tasks on the backend so that the CodePiple Deploy stage will deploy a new task and finish the pipeline (since the deploy stage has been running for 40 minutes already 😑🤣)

## References:

- [CodeBuild push to ECR doesn't work](https://github.com/aws/aws-codebuild-docker-images/issues/558)
- [AWS ECS - exit code 137](https://stackoverflow.com/questions/46282928/aws-ecs-exit-code-137)
