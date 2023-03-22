# Week 4 — Postgres and RDS

## Required Homework
- Watched [Week 4 - Relational Databases](https://www.youtube.com/watch?v=EtD7Kv5YCUs&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=46)
- Watched [SQL RDS](https://www.youtube.com/watch?v=Sa2iB33sKFo&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=47)
- Watched [Cognito Post Confirmation Lambda](https://www.youtube.com/watch?v=7qP4RcY2MwU&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=48)
- Watched [Creating Activities](https://www.youtube.com/watch?v=fTksxEQExL4&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=49)
- Watched [Ashish's Week 4 - Security Considerations](https://www.youtube.com/watch?v=UourWxz7iQg&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=45)
- Completed Security Quiz

### Tasks
- Create AWS RDS instance
  ```sh
  aws rds create-db-instance \
  --db-instance-identifier cruddur-db-instance \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version  14.6 \
  --master-username cruddurroot \
  --master-user-password <PASSWORD> \
  --allocated-storage 20 \
  --availability-zone us-east-1a \
  --backup-retention-period 0 \
  --port 5432 \
  --no-multi-az \
  --db-name cruddur \
  --storage-type gp2 \
  --publicly-accessible \
  --storage-encrypted \
  --enable-performance-insights \
  --performance-insights-retention-period 7 \
  --no-deletion-protection
  ```
  ![image](https://user-images.githubusercontent.com/71366703/226793719-ed9951ff-16ae-4ba6-9bdc-fe056dfd5cd4.png)
- Temporarily stop the AWS RDS instance.
- Run the local postgres database and setup its environment variables:
  - The connection url syntax is: `postgresql://<USER>:<PASSWORD>@<NETWORK>:<PORT>/<DATABASE_NAME>`, so in our project the local db connection url is:
    ```sh
    postgresql://postgres:password@localhost:5432/cruddur
    ```
  - Test connection to the local db using the command:
    ```sh
    psql -U postgres --host localhost
    ```
- Setup the environment variable for the production db url with the syntax: `postgresql://<USER>:<PASSWORD>@<AWS_RDS_ENDPOINT>/<DATABASE_NAME>`
- Setup scripts for the database, schema and seed (See commit [498f9a7](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/498f9a7ca17068ed08c9c0b804b64bccd17ac541))
- Install the postgres driver for the backend which is `psycopg[binary]` and `psycopg[pool]`
- Replace the mock data in the `home_activities.py` file to an sql query and test it on the local database
  ```py
  sql = query_wrap_array("""
      SELECT
        activities.uuid,
        users.display_name,
        users.handle,
        activities.message,
        activities.replies_count,
        activities.reposts_count,
        activities.likes_count,
        activities.reply_to_activity_uuid,
        activities.expires_at,
        activities.created_at
      FROM public.activities
      LEFT JOIN public.users ON users.uuid = activities.user_uuid
      ORDER BY activities.created_at DESC
      """)
      with pool.connection() as conn:
        with conn.cursor() as cur:
          cur.execute(sql)
          # this will return a tuple
          # the first field being the data
          # json = cur.fetchall()
          json = cur.fetchone()
      return json[0]
  ```
- Update the Security Group Inbound Rule of the RDS instance so that we can connect to it by creating a script where it gets the GITPOD IP address and passes it to the aws cli and it will always initialize it everytime we spin up a gitpod environment.
  - For the `.gitpod.yml file`, we added this command under the postgres task:
    ```yml
    command: |
      export GITPOD_IP=$(curl ifconfig.me)
      source "$THEIA_WORKSPACE_ROOT/backend-flask/rds-update-sg-rule"
    ```
  - For the script, the file was named `rds-update-sg-rule` and is placed inside backend-flask/bin and the command is:
    ```sh
    #! /usr/bin/bash
    set -e # stop if it fails at any point

    CYAN='\033[1;36m'
    NO_COLOR='\033[0m'
    LABEL="rds-update-sg-rule"
    printf "${CYAN}==== ${LABEL}${NO_COLOR}\n"

    aws ec2 modify-security-group-rules \
        --group-id $DB_SG_ID \
        --security-group-rules "SecurityGroupRuleId=$DB_SG_RULE_ID,SecurityGroupRule={Description=GITPOD,IpProtocol=tcp,FromPort=5432,ToPort=5432,CidrIpv4=$GITPOD_IP/32}"
    ```
- Create a Lambda Trigger when pushing data to the aws rds database. Here we used an already provided prostgres driver (psycopg) for lambda. Since I am on us-east-1 region, I used this layer arn: `arn:aws:lambda:us-east-1:898466741470:layer:psycopg2-py38:2` contrary to what Andrew put on the video since he is in canada region. (See commit [ca46c9b)](https://github.com/timmy-cde/aws-bootcamp-cruddur-2023/commit/ca46c9b7c88f1937809a2dc2ae56845f9beb1823)
- Tested creating the user and inserting it to aws rds and the cloudwatch logs show that it has no error.
  ![image](https://user-images.githubusercontent.com/71366703/226793595-5eb2fb4c-6741-498c-80c0-99a4e85fd318.png)
