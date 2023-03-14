# Week 3 — Decentralized Authentication

## Table of Contents
| Required Homework | | Homework Challenge|
| :--- | :--- | :--- |
| [Set up Cognito User Pool](#set-up-cognito-user-pool) | | [Beautify Forgot Page](#beautify-forgot-page) |
| [Implement Custom Sign-In Page](#implement-custom-sign-in-page) | | [Decouple the JWT verify by Container Sidecar pattern using aws-jwt-verify.js library](#decouple-the-jwt-verify-by-container-sidecar-pattern-using-aws-jwt-verifyjs-library) |
| [Implement Custom Sign-Up Page and Custom Confirmation Page](#implement-custom-sign-up-page-and-custom-confirmation-page) | | [Implement checkAuth on pages missed](#implement-checkauth-on-pages-missed) |
| [Implement Custom Recovery Page](#implement-custom-recovery-page)| |

## Required Homework

### Set up Cognito User Pool
- Create a cognito user pool

  ![image](https://user-images.githubusercontent.com/71366703/224493207-fcecaf6f-6d6f-416b-bec5-0e336e867dc2.png)
- Install `aws-amplify` on the frontend set the environment variables on `docker-compose` file and configure the aws cognito in `App.js` file [(commit id 188f00e)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/188f00ef911932af6fcd8816a90b0fc4262c0841)
  - on docker-compose.yml
    ```yml
    REACT_APP_PROJECT_REGION: "${AWS_DEFAULT_REGION}"
    REACT_APP_AWS_COGNITO_REGION: "${AWS_DEFAULT_REGION}"
    REACT_APP_AWS_USER_POOLS_ID: <VALUE>
    REACT_APP_CLIENT_ID: <VALUE>
    ```
  - on App.js
    ```js
    import { Amplify } from 'aws-amplify';

    Amplify.configure({
      "AWS_PROJECT_REGION": process.env.REACT_APP_PROJECT_REGION,
      "aws_cognito_region": process.env.REACT_APP_AWS_COGNITO_REGION,
      "aws_user_pools_id": process.env.REACT_APP_AWS_USER_POOLS_ID,
      "aws_user_pools_web_client_id": process.env.REACT_APP_CLIENT_ID,
      "oauth": {},
      Auth: {
        region: process.env.REACT_APP_PROJECT_REGION,
        userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,
        userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,
      }
    });
    ```

### Implement Custom Sign-In Page
- Create a user in the aws cognito console

  ![image](https://user-images.githubusercontent.com/71366703/224494227-8a981be2-ac31-41b5-b269-0b30a49917c9.png)

  We can see that the confirmation status is not confirmed, so what can we do is run the command below to make it confirmed: 
  ```sh
  aws cognito-idp admin-set-user-password --user-pool-id <VALUE> --username <VALUE> --password <VALUE> --permanent
  ```
  ![image](https://user-images.githubusercontent.com/71366703/224494719-d4042b31-5519-4645-835e-df75bd7b64e1.png)
- Set up the `HomeFeedPage.js` and `ProfileInfo.js` [(See commit 58a617f)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/58a617f692358f38d73e696f7c2b11f256e68749)

### Implement Custom Sign-Up Page and Custom Confirmation Page
- Setup the `SignupPage.js` and `ConfirmationPage.js` [(See commit 610dd6e)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/610dd6e6d3859606e61b96dc4392e249575daa89)
- Test the code:
  - After signing up, the confirmation page loads:
    ![image](https://user-images.githubusercontent.com/71366703/224495404-7ae84cf0-cba6-4108-8afb-7bd076893d4b.png)
  - Check the email for the code
    ![image](https://user-images.githubusercontent.com/71366703/224495441-2f5c27ac-2413-4acd-94b6-022a2bfe313b.png)
  - Put it to the confirmation page, and sign in.
    ![image](https://user-images.githubusercontent.com/71366703/224495526-88656706-5421-428b-a98a-51fe7b4e1806.png)


### Implement Custom Recovery Page
- Setup `RecoverPage.js` [See commit 2097773](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/2097773c8900a86d79158e2c5770942e7b9be2fb)
- Test the code:
  - Click forgot password on signin.
    ![image](https://user-images.githubusercontent.com/71366703/224495716-ddc67b12-b2a0-4dd2-a8fa-cd700f2e6f7f.png)
  - Check the email for the code:
    ![image](https://user-images.githubusercontent.com/71366703/224495750-3afc6760-7d7e-4474-b415-7babed29164a.png)
  - Reset the password
    ![image](https://user-images.githubusercontent.com/71366703/224495779-4078509c-3b21-4114-8ba7-8e21f8a986df.png)
  - Recovery success
    ![image](https://user-images.githubusercontent.com/71366703/224495805-6fbbcac5-1c09-4e3e-b3c9-0a53a47c6974.png)
  - Sign in again
    ![image](https://user-images.githubusercontent.com/71366703/224495828-f1fe5d00-33a5-4c54-b7f4-244a7e4f9dc2.png)

---

## Homework Challenges

### Beautify Forgot Page
- Added styles on the last part of forgot page [(commit d4bd01a)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/d4bd01af53609c8e5be1580189b8b6365a84c161)

### Decouple the JWT verify by Container Sidecar pattern using aws-jwt-verify.js library
- I first started by creating a new folder named `jwt-node-sidecar` and inside it I created a Dockerfile to serve a nodejs environment on port 4000
  ```Dockerfile
  FROM node:16.18

  ENV PORT=4000

  WORKDIR /jwt-node-sidecar
  COPY . .
  EXPOSE ${PORT}

  RUN apt-get update 
  RUN apt-get install -y gcc
  RUN apt-get install -y curl

  RUN npm install
  CMD ["npx", "nodemon", "index.js"]
  ```
- I also added the Dockerfile to build in the `docker-compose.yml` file
  ```yml
  nodejs-sidecar:
    environment:
      BACKEND_URL: "https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
      AWS_USER_POOLS_ID: "us-east-1_bnfXCOI56"
      APP_CLIENT_ID: "7gojn9iqpjabsdsq7q18a5i24l"
    build: ./jwt-node-sidecar
    ports:
      - 4000:4000
    volumes:
      - ./jwt-node-sidecar:/jwt-node-sidecar
      - /jwt-node-sidecar/node_modules
  ```
- I also added on `.gitpod.yml` file the port 4000 to be public
  ```yml
    ports:
      - name: nodejs-sidecar
        port: 4000
        visibility: public
    ```
- Back to the `jwt-node-sidecar` folder, I initialize a node project using `npm init` and installed dependencies
  ```sh
  npm install aws-jwt-verify express cors
  npm install --save-dev nodemon
  ```
- Inside the folder, I created an `index.js` file and created a simple express server and tested it first locally using the command `npx nodemon index.js` and later using `docker compose` command
  ```js
  const express = require('express');
  const cors = require('cors');
  const { urlencoded } = require('express');

  const app = express()
  const port = 4000;

  app.use(cors())
  app.use(express.json())
  app.use(urlencoded({ extended: true }))

  app.get('/', () => {
    console.log('Hello')
  })

  app.listen(process.env.PORT || port, () => {
      console.log(`JWT Sidecar is now online on port ${process.env.PORT || port}`)
  })
  ```
- I read the aws-jwt-verify [documentation](https://github.com/awslabs/aws-jwt-verify#express) and copied the sample code for express.
  ```js
  const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: "<user_pool_id>",
    tokenUse: "access",
    clientId: "<client_id>",
    scope: "read",
  });

  app.get("/", async (req, res, next) => {
    try {
      // A valid JWT is expected in the HTTP header "authorization"
      await jwtVerifier.verify(req.header("authorization"));
    } catch (err) {
      console.error(err);
      return res.status(403).json({ statusCode: 403, message: "Forbidden" });
    }
    res.json({ private: "only visible to users sending a valid JWT" });
  });

  // Hydrate the JWT verifier, then start express.
  // Hydrating the verifier makes sure the JWKS is loaded into the JWT verifier,
  // so it can verify JWTs immediately without any latency.
  // (Alternatively, just start express, the JWKS will be downloaded when the first JWT is being verified then)
  jwtVerifier
    .hydrate()
    .catch((err) => {
      console.error(`Failed to hydrate JWT verifier: ${err}`);
      process.exit(1);
    })
    .then(() =>
      app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
      })
    );
  ```
- Here I had to debug what the `app.py` in backend sends to the sidecar and what the `index.js` on sidecar sends back to the backend, and after a series of debugging, this is what the code looks like:
  - In `app.py` file I commented out the parts that uses the `cognito_jwt_token.py` and replaced it with the sidecar, for readability purposes I removed them in here. I found out that my `requests.get` does not send the correct header, so I extracted the header instead and sent it to the `requests.get` command as a request body. Then parse the claims result into a json object.
    ```py
    def data_home():
      try:
        data = {"auth": request.headers["Authorization"]}
        claims = requests.get(os.getenv("SIDECAR_URL"), json=data)
        claims_json = claims.json()
        # authenticated request
        app.logger.debug('authenticated')
        app.logger.debug(claims_json)
        app.logger.debug(claims_json['username'])
        data = HomeActivities.run(cognito_user_id=claims_json['username'])
      except Exception as e:
        # unauthenticated request
        app.logger.debug(e)
        app.logger.debug('unauthenticated')
        data = HomeActivities.run()

      return data, 200
    ```
  - In `index.js` file of the sidecar, I received the authorization token in the request body, split it and save the token in a variable, then I return the result in `res.json` command. (for readability purposes, I removed the comments here)
    ```js
    app.get("/", async (req, res, next) => {
        try {
            token = req.body.auth.split(' ')
            access_token = token[1]
            const claims = await jwtVerifier.verify(access_token);
            res.json(claims)
        } catch (err) {
            console.error(err);
            return res.status(403).json({ statusCode: 403, message: "Forbidden" });
        }
    });
    ```

### Implement checkAuth on pages missed
- After finishing the sidecar, I noticed that the login is not persistent on the other pages except the Homefeed page, so I updated the checkAuth of the following pages to the new checkAuth:
  - MessageGroupPage
  - MessageGroupsPage
  - NotificationsFeedPage
  - UserFeedPage
