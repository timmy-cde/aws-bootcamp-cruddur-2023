# Week 5 — DynamoDB

## Required Homework

- Watched [Week 5 - NoSQL and Caching](https://www.youtube.com/watch?v=5oZHNOaL8Og&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=50)
- Watched [DynamoDB Utility Scripts](https://www.youtube.com/watch?v=pIGi_9E_GwA&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=52&t=4s)
- Watched [Implement Conversations with DynamoDB](https://www.youtube.com/watch?v=dWHOsXiAIBU&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=54)
- Watched [DynamoDB Streams](https://www.youtube.com/watch?v=zGnzM_YdMJU&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=55)
- Watched [Ashish's Week 5 Security Considerations](https://www.youtube.com/watch?v=gFPljPNnK2Q&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=51)
- Watched [Lou Bichard's Cloud Careers](https://www.youtube.com/watch?v=S_89vwVHC9Y&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=56&t=2s)
- Completed Security Quiz

## DynamoDB Design

- The primary key (pk) can be a `message_group` or an `other_user_uuid`
- The sort key (sk) can be the time where the message group is `created_at` or the `last_reply_at`
- The display name and handle can the the _current user_ or the _other user_

|            pk            |         sk          |  display_name  |   handle   | message |     user_uuid     |  message_group_uuid  |
| :----------------------: | :-----------------: | :------------: | :--------: | :-----: | :---------------: | :------------------: |
| MSG#{message_group_uuid} |  MSG#{created_at}   | Timothy Manuel | timmy-cde  | Hello!  | {timmy_cde_uuid}  | {message-group-uuid} |
|   GRP#{timmy_cde_uuid}   | GRP#{last_reply_at} |   Tim Suarez   | tim-suarez | Hooray! | {tim_suarez_uuid} | {message-group-uuid} |

## Access Patterns

1. List the message groups showing the last replied message.
2. Show the messages in a message group with the messages sorted in descending order of time (oldest to newest).
3. Send a message. If it has no message group, it will create a message group with the other user. If it has an existing message group, it will append the new message at the end.

## Tasks

- Restructure the bash commands and sql files inside the `backend-flask` folder
  ```sh
  ├── backend-flask
  │   ├── bin
  │   │   ├── cognito
  │   │   │   └── list-users
  │   │   ├── db
  │   │   │   ├── connect
  │   │   │   ├── create
  │   │   │   ├── drop
  │   │   │   ├── schema-load
  │   │   │   ├── seed
  │   │   │   ├── sessions
  │   │   │   ├── setup
  │   │   │   └── update_cognito_user_ids
  │   │   ├── ddb
  │   │   │   │ └── patterns
  │   │   │   │     ├── get-conversation
  │   │   │   │     └── list-conversation
  │   │   │   ├── drop
  │   │   │   ├── list-tables
  │   │   │   ├── scan
  │   │   │   ├── schema-load
  │   │   │   └── seed
  │   │   └── rds
  │   │       └── update-sg-rule
  │   │
  │   ├── db
  │   │   ├── sql
  │   │   │   ├── activities
  │   │   │   │     ├── create.sql
  │   │   │   │     ├── home.sql
  │   │   │   │     └── object.sql
  │   │   │   └── users
  │   │   │         ├── create_message_users.sql
  │   │   │         ├── short.sql
  │   │   │         └── uuid_from_cognito_user_id.sql
  │   │   ├── schema.sql
  │   │   └── seed.sql
  │   │
  │   └── ...
  └── ...
  ```
- Create the additional bash scripts and the sql files above, and create a class for all the functions of the DynamoDB inside the `lib/ddb.py` file.
- Refactor the `message_groups.py` to query the data from PostgreSQL and DynamoDB instead of the hardcoded values.
- In the frontend part, made the `checkAuth()` function into a separate file and imported it to the `HomeFeedPage.js`, `MessageGroupPage.js` and `MessageGroupsPage.js`.
- Also in the frontend part, we added the `Authorization` header in the `MessageForm.js` and in the `MessageGroupsPage.js`.
- In `app.py` file, we added a new route `/api/users/<string:handle>/short` and refactored the codes:
  - inside the `/api/messages/<string:message_group_uuid>` route to handle authentication and pass the `cognito_user_id` and `message_group_uuid` in the `Messages.run()` function.
  - inside the `/api/messages/` route to handle authentication and pass the `mode`, `message`, `cognito_user_id` and `user_receiver_handle` in the `CreateMessage.run()` function.
- In the `App.js` file we added a new path `/messages/new/:handle` and created the page and components linked to it namely `MesssageGroupNewPage.js` and `MessageGroupNewItem.js`.
- Add the `list_messages` and `create_message` function in the `lib/ddb.py` file.
- Refactor the `messages.py` to query the data from PostgreSQL and DynamoDB instead of the hardcoded values.
- Add the `AWS_ENPOINT_URL` env variable under the backend-flask services of the `docker-compose.yml` file to access the local dynamodb in order to test it first on the local before testing it on the production.
- In the AWS Console, we created a new lamba function for the DynamoDB streams and set its policies `AWSLambdaInvocation-DynamoDB` which is aws managed and also the custom policy with the following properties:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "VisualEditor0",
        "Effect": "Allow",
        "Action": ["dynamodb:PutItem", "dynamodb:DeleteItem", "dynamodb:Query"],
        "Resource": [
          "arn:aws:dynamodb:us-east-1:532819517439:table/cruddur-messages/index/message-group-sk-index",
          "arn:aws:dynamodb:us-east-1:532819517439:table/cruddur-messages"
        ]
      }
    ]
  }
  ```
- In the `bin/ddb/schema-load` add the AttributeDefinition named `message_group_uuid` and also add the GlobalSecondaryIndexes
- Disable the `AWS_ENDPOINT_URL` in the `docker-compose.yml` file by commenting it and rerun the docker so that it will connect to the production DynamoDB instead of the local.
- Create a VPC Gateway Endpoint pointing to the DynamoDB service
- Load the DynamoDb schema into the production to create the table with the command `./bin/ddb/schema-load prod`.
  ![image](https://user-images.githubusercontent.com/71366703/227993390-620c91e3-70f9-4cce-8217-6f90df7774a6.png)
- In the _Exports and Streams_ tab, enable the DynamoDB Streams and connect the lambda trigger.
- Test the program. (I forgot to capture the messages in the web app and I found out when rerunning it again that it must have the same user uuid on the dynamodb and I don't want to edit the data on the production 😅)
  ![image](https://user-images.githubusercontent.com/71366703/227995584-0616e0a0-dfb3-4b55-b854-a2b87178c7ad.png)
  ![image](https://user-images.githubusercontent.com/71366703/227993952-da314304-4eae-4c1f-909f-8e2842f77d12.png)

### Debugging

These are the parts where I got stuck the most in debugging.

- In the `app.py` file inside the routes of `/api/message_groups`, I forgot to put these lines which in turn I always got an error code 401 instead of the 200 or 422
  ```py
  if model['errors'] is not None:
      return model['errors'], 422
    else:
      return model['data'], 200
  ```
- I cannot connect to the local posgresql db which I later resolved by changing its CONNECTION_URL value from `postgresql://postgres:password@localhost:5432/cruddur` to `postgresql://postgres:password@db:5432/cruddur`
- I also cannot change the `MOCK` value of the users in the local postgresql which I later resolved by changing the `seed.sql` values to be inserted in the database to the same names and emails from my cognito user pool. So I also added another user in my cognito pool to implement the conversation in the dynamodb. I also changed the hardcoded handle names with values of `andrewbrown` into my own handle of all the files in the backend to resolve any future errors since I have no user in my database called andrewbrown.
  - Old seed values:
    ```sql
    INSERT INTO public.users (display_name, email, handle, cognito_user_id)
    VALUES
    ('Andrew Brown', 'andrew@exampro.co', 'andrewbrown' ,'MOCK'),
    ('Andrew Bayko', 'bayko@exampro.co', 'bayko' ,'MOCK');
    ```
  - New seed values:
    ```sql
    INSERT INTO public.users (display_name, email, handle, cognito_user_id)
    VALUES
    ('Timothy Manuel', 'timothys.manuel@gmail.com', 'timmy-cde' ,'MOCK'),
    ('Tim Suarez', 'suareztim3@gmail.com', 'tim-suarez' ,'MOCK'),
    ('Londo Mollari', 'lmollari@centari.com', 'londo' ,'MOCK');
    ```
- I am also getting an error in react for the `className` which I found out that some of the className in the files of the frontend are misspelled into having three **s**.
