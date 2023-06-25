# Week X - Cleanup

## Homework

- [Week X Sync tool for static website hosting](#week-x-sync-tool-for-static-website-hosting)
- [Reconnect DB and Postgre Confirmation Lamba](#reconnect-db-and-postgre-confirmation-lamba)
- [Fix CORS to use domain name for web-app](#fix-cors-to-use-domain-name-for-web-app)
- [Ensure CI/CD pipeline works and create activity works](#ensure-cicd-pipeline-works-and-create-activity-works)
- [Refactor to use JWT Decorator in Flask App](#refactor-to-use-jwt-decorator-in-flask-app)
- [Refactor App.py and Flask Routes](#refactor-apppy-and-flask-routes)
- [Improved Error Handling for the app](#improved-error-handling-for-the-app)
- [Activities Show Page](#activities-show-page)
- [More General Cleanup Part 1 and Part 2](#more-general-cleanup-part-1-and-part-2)

## Challenges

- [Implement Github Actions for S3 Static Website Sync](#implement-github-actions-for-s3-static-website-sync)
- [Separated Backend Service and Task Definition CFN Template](#separated-backend-service-and-task-definition-cfn-template)

## Tasks

- ### Week X Sync tool for static website hosting

  I have created the sync tool using Fady's implementation. More details on this [section](#implement-github-actions-for-s3-static-website-sync).

- ### Reconnect DB and Postgre Confirmation Lamba

  ![Reconnect DB and Postgre Confirmation Lamba](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/58402ba7-ddce-48b4-9d88-08bd44d84201)

- ### Fix CORS to use domain name for web-app

  ![Fix-CORS-to-use-domain-name-for-web-app](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/622d7f87-9acc-4398-b44b-6b699d105074)

- ### Ensure CI/CD pipeline works and create activity works

  The CodePipeline source, build and deploy works.
  ![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/69be87c0-3d43-4c5f-9479-9884d74dc358)
  ![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/a5761380-0c5f-4386-92bf-1a821e2ffdb2)

  Creating activity also works
  ![create-activity-works](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/3b2fa187-3747-44fa-a37e-2032669b0945)

- ### Refactor to use JWT Decorator in Flask App

  Refactored the jwt verifier to become a decorator by adding this lines of code in `backend-flask/lib/cognito_jwt_token.py`

  ```py
  # imports
  from functools import wraps, partial
  from flask import request, g
  import os
  from flask import current_app as app

  # code (this is outside of CognitoJwtToken class)
  def jwt_required(f=None, on_error=None):
    if f is None:
        return partial(jwt_required, on_error=on_error)

    @wraps(f)
    def decorated_function(*args, **kwargs):
        cognito_jwt_token = CognitoJwtToken(
            user_pool_id=os.getenv("AWS_COGNITO_USER_POOL_ID"),
            user_pool_client_id=os.getenv("AWS_COGNITO_USER_POOL_CLIENT_ID"),
            region=os.getenv("AWS_DEFAULT_REGION")
        )
        access_token = CognitoJwtToken.extract_access_token(request.headers)
        try:
            claims = cognito_jwt_token.verify(access_token)
            # is this a bad idea using a global?
            g.cognito_user_id = claims['sub']  # storing the user_id in the global g object
        except TokenVerifyError as e:
            # unauthenticated request
            app.logger.debug(e)
            if on_error:
                return on_error(e)
            return {}, 401
        return f(*args, **kwargs)
    return decorated_function
  ```

- ### Refactor App.py and Flask Routes

  Refactored app.py and its routes as seen on the videos.

  ![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/ef192c79-657e-4035-aa35-5258273fbce7)

- ### Implement Replies for Posts

  ![Implement-replies](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/0a0f5bc6-fccf-45fe-9a17-c89fdb1e8c3a)

- ### Improved Error Handling for the app

  ![error-handling](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/1228d9ad-f848-4a67-9aba-d1827fecc9a4)

- ### Activities Show Page

  With the twitter as a pattern, we also implemented the page where we can view all the replies to a crud.
  ![Activities-Show-Page](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/f9da32df-5140-4d0e-9478-d65306a0ab96)

- ### More General Cleanup Part 1 and Part 2

  Implemented all the cleanup as done on the videos and also added some:

  - #### Hide all the replies in the Home Feed Page by:

    - Adding `activities.reply_to_activity_uuid,` in `activities/show.sql` of the backend
    - Adding `WHERE reply_to_activity_uuid IS NULL` in `activities/home.sql` of the backend

      ![Hide-all-the-replies-in-the-Home-Feed-Page](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/2b7f9597-adbd-4149-973a-eb5299be83a9)

  - #### Fix the alignment on the activity page like twitter

    ![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/e1b639d6-56d5-40e3-89db-d15e02f6195a)

  - #### Show user's avatar in Home Feed, Replies and Profile Page:

    > I also tried to show avatar on messages but I struggled on DynamoDb since for some reason it does not save the cognito_user_id in the message groups even if it is passed on the batch_write_item()

    Home Feed
    ![home-feed](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/5904a770-e6b3-48f4-8864-acd4261f45a5)

    Replies
    ![replies](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/7f733156-c790-4fa9-bd33-c1dfd425e6b7)

    Profile Page
    ![profile-page](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/300b99ac-7562-469c-a3b5-8de9bdb6e34d)

  - #### Implement Back Button in Profile Page
    ![added-back-button-in-profile](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/31bad9c4-200a-4aaa-9880-9317c2ab6658)

## Challenges

- ### Implement Github Actions for S3 Static Website Sync

  I implemented the github actions using Fady's [implementation](https://github.com/FadyGrAb/aws-bootcamp-cruddur-2023/blob/week-x/.github/workflows/sync-static-website.yml), but the difference was I saved all the env variables as github actions repository secrets in github.
  ![github-actions](assests/week-x/github-actions.gif)

- ### Separated Backend Service and Task Definition CFN Template

  During the cleanup, I have been troubleshooting on the error code 500 when creating messages even though I already changed the value of the table name to the env variable `DDB_MESSAGE_TABLE`. So instead of creating the changeset of the whole backend service every single time, I separated the [Task Definition](../aws/cfn/service-task-definition/template.yaml) with its roles (task and execution), and the [Backend Service](../aws/cfn/service/template.yaml).

  > It turns out, I forgot to build and push the new backend image to ecr or at least run the CodePipeline to update the backend image in the ECR 😅.

  ![image](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/assets/71366703/decad36d-5aa9-495d-b972-0122865d685f)
