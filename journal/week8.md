# Week 8 — Serverless Image Processing

## Required Homework

- [Setup CDK Serverless Image Process](#setup-cdk-serverless-image-process)
- [Serving Avatars via Cloudfront](#serving-avatars-via-cloudfront)
- [Implement Users Profile Page](#implement-users-profile-page)
- [Implement Backend Migrations](#implement-backend-migrations)
- [Implement Avatar Uploading](#implement-avatar-uploading)
- [Output](#output)

## Final Project Folder Directory Structure for this week

> Folders in Yellow are newly added this week.

```sh
📦aws-bootcamp-cruddur-2023
 ├─🗁 docs
 │  └─🗁 assests
 ├─🗁 aws
 │  ├─🗁 json
 │  ├─🗁 lambdas
 │  │  ├─📂 cruddur-upload-avatar
 │  │  ├─📂 lambda-authorizer
 │  │  └─📂 process-images
 │  ├─🗁 policies
 │  ├─📂 s3
 │  └─🗁 task definitions
 ├─🗁 backend-flask
 │  ├─🗁 bin
 │  ├─🗁 db
 │  │  ├─📂 migrations
 │  │  └─🗁 sql
 │  │     ├─🗁 activities
 │  │     └─🗁 users
 │  ├─🗁 lib
 │  └─🗁 services
 ├─🗁 bin
 │  ├─📂 avatar
 │  ├─🗁 backend
 │  ├─🗁 cognito
 │  ├─🗁 db
 │  ├─🗁 ddb
 │  ├─🗁 ecr
 │  ├─🗁 frontend
 │  ├─📂 generate
 │  ├─📂 lambda-layers
 │  └─🗁 rds
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

## Tasks

- ### Setup CDK Serverless Image Process

  - Create an S3 Bucket in AWS Console with the format `assets.<DOMAIN>` which for me is `assets.tmanuel.cloud` and create 2 folders named `avatars` and `banners`. Upload a `banner.jpg` file in the `banners` folder.
  - In the dev environment (gitpod), create `thumbing-serverless-cdk` folder.
  - Install AWS CDK globally using the command below and add it also to the `.gitpod.yml` file.
    ```sh
    npm install aws-cdk -g
    ```
  - Setup the needed environment variables in the `env.example` file and run the command `cp .env.example .env` and also add it to `.gitpod.yml` file. These are the variables needed:

    - UPLOADS_BUCKET_NAME
    - ASSETS_BUCKET_NAME
    - THUMBING_S3_FOLDER_OUTPUT
    - THUMBING_WEBHOOK_URL
    - THUMBING_TOPIC_NAME
    - THUMBING_FUNCTION_PATH

    > Here the S3 bucket where will we upload the file is named `cruddur-uploaded-avatars.tmanuel.cloud` and the bucket where the processed files by sharp will go to `assets.tmanuel.cloud`.

  - Initailze cdk project on `thumbing-serverless-cdk` and install `dotenv` using the command below. [(repo)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/tree/week-8/thumbing-serverless-cdk)
    ```sh
    cdk init app --language typescript
    npm i dotenv
    ```
    - In the `aws/lambdas` folder, create a folder named `process-images`. These will be our lambda for processing avatar images. Initialize the npm and install sharp. [(repo)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/tree/week-8/aws/lambdas/process-images)
    ```sh
    npm init -y
    npm install sharp @aws-sdk/client-s3
    ```
  - In our `bin` directory, we created the script `build` inside the `avatar` folder where it will include the sharp module in our cdk. [(code)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-8/bin/avatar/build)
  - Test the cdk code locally using the command `cdk synth`.
  - Deploy the cdk code using the command `cdk deploy`. We can go to AWS Cloudformation console to check if it was finished deploying our stacks. We can check the S3 and Lambda it if is generated.
  - In the `bin/avatar` folder, create scripts for `upload` and `clear` which will upload or delete the `data.jpg` file that we will upload to S3.
  - Test if the image is uploaded to `cruddur-uploaded-avatars.tmanuel.cloud`, processed by the lambda function and saved to `assets.tmanuel.cloud`. We can also see the Cloudwatch logs generated for further troubleshooting / confirmation.

- ### Serving Avatars via Cloudfront

  - We will use Amazon Cloudfront to access our images inside our S3 bucket. We created the distribution in the aws console with the following configuration:
    - Set the origin domain to the S3 bucket (assets.<DOMAIN>)
    - Set Origin access to `Origin access control settings`
    - Create the control setting and set the Origin type to S3.
      > Remember to copy the bucket settings provided and paste it to your S3 Bucket permissions later.
    - Disable Origin Shield (since this costs spend)
    - In the Default Cache Behavior, set the **Viewer protocol policy** to `Redirect HTTP to HTTPS`.
    - In the **Cache key and origin requests**, set Cache policy to `CachingOptimized`.
      > I later changed this to `CachingDisabled` so that the updated avatar will be rendered in the frontend and not the old image cached in Cloudfront.
      > Someone suggested in discord to add the path in the invalidation tab but it did not worked for me.
    - Set Origin request policy to `CORS-CustomOrigin`
    - Set Response headers policy to `SimpleCORS`
    - In **Web Application Firewall (WAF)**, choose `Do not enable security protection`
    - Add an Alternate domain name (CNAME) pointing to `assets.<DOMAIN>`
    - In Custom SSL certificate, choose the ACM we generate also for our Route53.
  - In our S3 bucket where we pointed the Cloudfront distribution, copy the generated json policy of our bucket in the distribution to our S3 Bucket Permissions.
  - In our Route53, add the CName `assets.<DOMAIN>` pointing to our Cloudfront Distirbution.

  > Here is the image that I uploaded: [data.jpg](https://assets.tmanuel.cloud/avatars/data.jpg)

- ### Implement Users Profile Page

  - Here are the files we updated/created for the Profile.

    ```sh
    🗁 backend-flask
     ├─🗁 bin
     │  └─🗁 db
     │     └─🗁 sql
     │        └─🗁 users
     │           ├─📜 show.sql
     │           └─📜 update.sql
     ├─🗁 services
     │  ├─📜 home_activites.py
     │  ├─📜 user_activites.py
     │  └─📜 update_profile.py
     └─📜 app.py

    🗁 frontend-react-js
     ├─🗁 src
     │  ├─🗁 components
     │  │  ├─📜 ActivityFeed.js
     │  │  ├─📜 CrudButton.js
     │  │  ├─📜 EditProfileButton.css
     │  │  ├─📜 EditProfileButton.js
     │  │  ├─📜 DesktopNavigation.js
     │  │  ├─📜 Popup.css
     │  │  ├─📜 ProfileAvatar.css
     │  │  ├─📜 ProfileAvatar.js
     │  │  ├─📜 ProfileForm.css
     │  │  ├─📜 ProfileForm.js
     │  │  ├─📜 ProfileHeading.css
     │  │  ├─📜 ProfileHeading.js
     │  │  ├─📜 ProfileInfo.js
     │  │  └─📜 ReplyForm.css
     │  ├─🗁 lib
     │  │  └─📜 CheckAuth.js
     │  ├─🗁 pages
     │  │  ├─📜 HomeFeedPage.js
     │  │  ├─📜 NotificationsFeedPage.js
     │  │  └─📜 UserFeedPage.js
     │  └─📜 App.js
     └─📜 jsconfig.json
    ```

- ### Implement Backend Migrations

  Based on twitter profile format, we also want to have a space for bio. So in order to do that, we need to add another column in our database for users schema. These is where the migrations came in and also the scripts we need to set up.

  - Create a `.keep` file inside the `backend-flask/db/migrations`
  - Inside the `bin/generate` folder, we created the `migration` script when the command `./bin/generate migration name`, it will create a migration file inside the `backend-flask/db/migrations` with the format `TIMESTAMP_Name.py`.
  - Update the `backend-flask/db/schema.sql` file to create `schema_information` table and insert the default values.
  - Update the functions in `backend-flask/lib/db.py` to include the verbose option.
  - Create `migrate` and `rollback` scripts in `bin/db`, when `./bin/db/migrate` is run, it will add the column `bio` in the `users` table. If `./bin/db/rollback` is run, it will undo the recent migration.
  - Add the `python "$DB_PATH/migrate"` on the `bin/db/setup` script.

- ### Implement Avatar Uploading

  To make our avatar uploading to S3 secure, we first need to generate a presigned URL from the S3 bucket we defined in our cdk where we will store the uploads.

  To implement this, instead of adding a new route to our `backend-flask/app.py`, we used the API Gateway to create an API endpoint where a Lambda named `CruddurApiGatewayLambdaAuthorizer` will be first triggered to verify the validity of the access token, and if it is valid, a Lambda named `CruddurAvatarUpload` will be triggered to request the presigned URL.

  - At `aws/lambda/cruddur-upload-avatar`:

    - Create `function.rb` file
    - Initialize the ruby environment using the command `bundle init`
    - Edit the Gemfile and add the following:
      ```ruby
      gem "aws-sdk-s3"
      gem "ox"
      gem "jwt"
      ```
    - Run `bundle install` to install the dependencies.
    - For local testing, we can run `bundle exec ruby function.rb` to generate the presigned url.

  - At `bin/lambda-layers`:

    - Create `ruby-jwt` script with the contents:

      ```sh
      #! /usr/bin/bash

      gem i jwt -Ni /tmp/lambda-layers/ruby-jwt/ruby/gems/2.7.0
      cd /tmp/lambda-layers/ruby-jwt/

      zip -r lambda-layers . -x ".*" "*/.*"
      zipinfo -t lambda-layers
      ```

    - Run the script and change directory to `/tmp/lambda-layers/ruby-jwt/`
    - Create a Lambda Layer using the command:
      ```sh
      aws lambda publish-layer-version \
      --layer-name jwt \
      --description "Lambda Layer for JWT" \
      --license-info "MIT" \
      --zip-file fileb://lambda-layers.zip  \
      --compatible-runtimes ruby2.7
      ```

  - At `aws/lambdas/lambda-authorizer`:

    - Create `index.js` file
    - Run the command: `npm install aws-jwt-verify --save`
    - Zip the file using the command `zip -r lambda_authorizer.zip .`

  - At `CruddurAvatarUpload` Lambda:

    - Paste the contents of the `aws/lambda/cruddur-upload-avatar/function.rb` to the lambda code source
    - Rename the filename in lambda as `function.rb`

      > Since we are currently at dev environment, always make sure to always update the current gitpod frontend url in `Access-Control-Allow-Origin` part of the code whenever we spin up a new gitpod environment.

    - In Runtime settings, change also the handler to `function.handler`
    - In the Layers, add the `jwt` layer we create earlier.
    - In the Configuration tab, add the environment variable `UPLOADS_BUCKET_NAME`
    - In the Permissions part of the Configuration tab, select the generated policy and add a new inline policy to it named `PresignedUrlAvatarPolicy` which grants the lambda the permission to put objects in S3. The permissions can also be seen at our repo [`aws/policies/s3-upload-avatar-presigned-url-policy.json`](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-8/aws/policies/s3-upload-avatar-presigned-url-policy.json)

  - At `CruddurApiGatewayLambdaAuthorizer` Lambda:

    - Download the `lambda_authorizer.zip` file generated at `aws/lambdas/lambda-authorizer` and upload it to the lambda code source.
    - In the Configuration tab, add the environment variables `CLIENT_ID` and `USER_POOL_ID`

  - At AWS S3 `cruddur-uploaded-avatars.tmanuel.cloud` bucket, in the Permission tab, we need to update the CORS configuration. We can also see the configuration at our repo [`aws/s3/cors.json`](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/blob/week-8/aws/s3/cors.json)

  - At AWS API Gateway, we build a **HTTP API** with the following configurations:
    - Add the `CruddurAvatarUpload` as our Lambda integration
    - Add the api name `api.<DOMAIN>`
    - Add the routes:
      - `/avatars/key_upload` route using `POST` method
        - Integration: `CruddurAvatarUpload`
        - Authorization: `CruddurApiGatewayLambdaAuthorizer`
      - `/{proxy+}` route using `OPTIONS` method
        - Integration: `CruddurAvatarUpload`
        - Authorization: none
          > Since we are using the `$default` stage, The $default route catches requests that don't explicitly match other routes in your API as said in the documentations:
          >
          > - [Working with the $default route](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html#http-api-develop-routes.default)
          > - [Working with HTTP proxy integrations for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-http.html)

- ### Output

  At gitpod dev environment, run the commands:

  ```sh
  ./bin/bootstrap
  docker compose up
  ./bin/db/setup
  ./bin/ddb/schema-load
  ./bin/ddb/seed
  ```

  Don't forget to update your frontend url in the `CruddurAvatarUpload` lambda code.

  ![Media2 (2)](https://user-images.githubusercontent.com/71366703/233824728-7fd2c359-1df4-4285-ba63-352c71d8929b.gif)
