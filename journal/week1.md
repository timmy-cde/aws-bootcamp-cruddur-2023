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
  
  ### Run Postgres Container
  
  
  ## Homework Challenges
  
  
  
