# Week 5 — DynamoDB and Serverless Caching

## Required Homework

- Watched [Week 5 - NoSQL and Caching]()
- Watched [DynamoDB Utility Scripts]()
- Watched [Implement Conversations with DynamoDB]()
- Watched [DynamoDB Streams]()
- Watched [Ashish's Week 5 Security Considerations]()
- Watched [Lou Bichard's Cloud Careers]()
- Completed Security Quiz

## DynamoDB Design

- The primary key (pk) can be a `message_group` or an `other_user_uuid`
- The sort key (sk) can be the time where the message_group is `created_at` or the `last_reply_at`
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

- Restructure the bash commands inside the `backend-flask` folder
  ```sh
  ├── backend-flask
  │   ├── bin
  │   │   ├── cognito
  │   │       └── list-users
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
  │   └── ...
  └── ...
  ```
