# Week 1 — App Containerization

## Required Homework

### Containerize Application

- Added Dockerfile on backend
  (See [Dockerfile)](../backend-flask/Dockerfile) on /backend-flask/Dockerfile

- Added Dockerfile on frontend
  (See [Dockerfile](../frontend-react-js/Dockerfile) on /frontend-react-js/Dockerfile)

- Added Docker Compose
  (See [docker-compose](../docker-compose.yml) on /docker-compose.yml)
  
  
  ### Added Notifications Endpoint for OpenAI
  - Added `/api/activities/notifications` endpoint under the `paths:` of the [openapi-3.0.yml](../backend-flask/openapi-3.0.yml) file on the backend.
  ```yml
  /api/activities/notifications:
    get:
      description: "Return a feed of activity for all of those that I follow"
      tags:
        - activities
      parameters: []
      responses:
        "200":
          description: "Returns an array of activities"
          content:
            application/json:
              schema:
                type: array
                items: 
                  $ref: '#/components/schemas/Activity'
  ```
  
  ### Write Notifications backend endpoint
  - Added `/api/activities/notifications` route on [app.py](../backend-flask/app.py) file on backend
    ```py
    @app.route("/api/activities/notifications", methods=['GET'])
    def data_notifications():
      data = NotificationsActivities.run()
      return data, 200
    ```
  - Added [`notifications_activities.py`](../backend-flask/services/notifications_activities.py) file on [services](../backend-flask/services/) folder of the backend
  
  ### Write Notifications React Page
  - Added the `/notifications` route on [App.js](../frontend-react-js/src/App.js) file
    ```js
    {
      path: "/notifications",
      element: <NotificationsFeedPage />
    },
    ```
    
  - Added the [`NotificationsFeedPage.js`](../frontend-react-js/src/pages/NotificationsFeedPage.js) file on the /src/pages folder of the frontend

  ### Run Local DynamoDB container
  - Added `dynamodb-local` under the `services` part in the [docker-compose.yml](../docker-compose.yml) file.
    ```yml
    dynamodb-local:
      # https://stackoverflow.com/questions/67533058/persist-local-dynamodb-data-in-volumes-lack-permission-unable-to-open-databa
      # We needed to add user:root to get this working.
      user: root
      command: "-jar DynamoDBLocal.jar -sharedDb -dbPath ./data"
      image: "amazon/dynamodb-local:latest"
      container_name: dynamodb-local
      ports:
        - "8000:8000"
      volumes:
        - "./docker/dynamodb:/home/dynamodblocal/data"
      working_dir: /home/dynamodblocal
    ```
  - Run the `docker compose up` command and we can see below that the port `8000` is running
    ![db-1](/assests/week1/db-1.png)
  - Test DynamoDB locally
    - Create Table
      ![db-2](/assests/week1/db-2.png)
    - Create Item
      ![db-3](/assests/week1/db-3.png)
    - List Tables
      ![db-4](/assests/week1/db-4.png)
    - Get Records
      ![db-5](/assests/week1/db-5.png)
  
  ### Run Postgres Container
  - Added `db` under the `services` part in the [docker-compose.yml](../docker-compose.yml) file.
    ```yml
    db:
      image: postgres:13-alpine
      restart: always
      environment:
        - POSTGRES_USER=postgres
        - POSTGRES_PASSWORD=password
      ports:
        - '5432:5432'
      volumes: 
        - db:/var/lib/postgresql/data
    ```
  - Added `volumes` in the [docker-compose.yml](../docker-compose.yml) file.
    ```yml
    volumes:
      db:
        driver: local
    ```
  - Run the `docker compose up` command and we can see below that the port `5432` is running
    ![db-1](/assests/week1/db-1.png)
  - Connect to postgres client
    ![db-6](/assests/week1/db-6.png)
  - Connect to postgres cli
    We can see to the left that the postgres client is also connected
    ![db-7](/assests/week1/db-7.png)
    
  
  ## Homework Challenges
  
  
  
