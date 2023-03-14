# Week 3 — Decentralized Authentication

## Table of Contents
| Required Homework | | Homework Challenge|
| :--- | :--- | :--- |
| [Set up Cognito User Pool](#set-up-cognito-user-pool) | | [Beautify Forgot Page](#beautify-forgot-page) |
| [Implement Custom Sign-In Page](#implement-custom-sign-in-page) | |
| [Implement Custom Sign-Up Page and Custom Confirmation Page](#implement-custom-sign-up-page-and-custom-confirmation-page) | |
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
