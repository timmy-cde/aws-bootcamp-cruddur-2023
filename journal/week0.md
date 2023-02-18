# Week 0 — Billing and Architecture

For this week, we learned about the architecture of the Cruddur app, setting up AWS group, users and permission and setting up the billing of our account.

## Required Homework

### Recreate Conceptual Diagram in Lucid Charts

[Conceptual Diagram Lucid Link](https://lucid.app/lucidchart/8361737b-54e1-4f46-ac6c-af16d65bd388/edit?viewport_loc=-3151%2C-1376%2C2328%2C1106%2C0_0&invitationId=inv_846d6836-7dbf-4d64-bbe6-f0b0bafcc3b8)
![Conceptual Diagram](assests/week0/Cruddur-Conceptual%20Diagram.png)

### Recreate Logical Architectual Diagram in Lucid Charts

[Logical Diagram Lucid Link](https://lucid.app/lucidchart/39d35bd5-5a18-44de-aa2f-5e16be91cc5e/edit?viewport_loc=-400%2C-609%2C3487%2C1893%2C0_0&invitationId=inv_cec5b94d-947f-478e-a654-a67c5e94dd93)
![Logical Diagram](assests/week0/Cruddur%20-%20Logical%20Diagram.jpeg)

### Create an Admin User

I created a user group "user-dev-admin" and attached the admin policy.

My root account is **timmy-cde** and my admin user is **tim-dev**.

- User group **user-dev-admin** and admin user **tim-dev**
  ![User Group and its user](assests/week0/02-CreateUserGroupAndUser.jpg)

- User Group Policies
  ![User Group Policies](assests/week0/03-SetPermissions.png)

### Generate AWS Credentials

I installed aws cli on gitpod and also added it on [.gitpod.yml](../.gitpod.yml)

![AWS Credentials](assests/week0/04-SetIdentity.png)

### Create Billing Alarm

From here on, I first set the SNS, Alarm and Budget using _console_ before recreating it using _aws cli._

- SNS Topic (Console)

  As you can see the image below, **Default_CloudWatch_Alarms_Topic** is set using aws console and the **billing-alarm** is set using aws cli.
  ![SNS Console](assests/week0/09-SNSTopicsConsole.png)

- SNS Topic (CLI)

  For setting SNS using AWS CLI I first generated a SNS Topic ARN.
  ![SNS Topic ARN](assests/week0/06-SNSTopic.jpg)

  Subscribe to SNS created

  ![SNS Subscribe](assests/week0/07-SNSSubscription.jpg)

  Confirmed the sns subscription sent on the email (I used my mobile phone to confirm).
  | Email Confirmation | Confirmed |
  | :---: | :---: |
  | ![SNS Email](assests/week0/08-SNSConfimation-1.png) | ![SNS Confirm](assests/week0/08-SNSConfimation2.png) |

  Checked my subscriptions on the cli. The list shows 2 items since I first created my subscription using console before recreating it again on cli.
  ![SNS CLI](assests/week0/09-SNSTopicsCLI.jpg)

- Billing Alarm

  Here we set the alarm using `cloudwatch put-metric` command with the file [alarm-config.json](../aws/json/alarm-config.json). Contrary to the $1 limit that is used on the video, I changed the threshold to 100 so that the alarm will only start to trigger if it is 80% of $100. After this, I then checked in the cli the list of cloudwatch alarms.
  | ![Billing Alarm (CLI) - 1](assests/week0/10-CloudwatchAlarmsCLI-1.jpg) |
  | ---------------------------------------------------------------------- |
  | ![Billing Alarm (CLI) - 2](assests/week0/10-CloudwatchAlarmsCLI-2.jpg) |

  We can also view it in the console.
  ![Billling Alarm (Console)](assests/week0/10-CloudwatchAlarmsConsole.jpg)

### Create Budget

I first set the Budget using _console_ before recreating it using _aws cli._

Using AWS CLI, we used the `budgets create-budget` command with the files [budget.json](../aws/json/budget.json) and [budget-notifications-with-subscribers.json](../aws/json/budget-notifications-with-subscribers.json). The budget created using CLI is **Example Tag Budget** and it has a budget of $100 since we also set our budget alarm to $100. **My AWS Cloud Project Bootcamp Cost Budget** is done using the console with the budget of $10.

I then checked the budgets using the `budgets describe-budgets` command.

| ![Budgets CLI-1](assests/week0/05-BudgetsCLI-1.png) |
| --------------------------------------------------- |
| ![Budgets CLI-2](assests/week0/05-BudgetsCLI-2.png) |

We can also view the budgets on the console.
![Budget Console](assests/week0/05-BudgetsConsole.jpg)

---

## Homework Challenges

### Set IAM MFA on root and admin account

- On Root Account
  ![MFA root](assests/week0/MFA-root.png)

- On Admin Account
  ![MFA admin](assests/week0/MFA-user.png)

### Use EventBridge to hookup Health Dashboard to SNS and send notification when there is a service health issue.

In this part, I successfully created the eventbridge rule but I do not know how to test the AWS Health Dashboard to open an issue that will trigger the eventbridge to sent a notification on Amazon SNS.

Here we can see my event rule named as **Health-Event** and the event pattern source is set to `aws.health`.
![EventBridge-1](assests/week0/Eventbridge-1.png)

We can also see the target here as the SNS Topic I created named `health-eventbridge`.
![EventBridge-2](assests/week0/Eventbridge-2.png)

### Create an architectural diagram (to the best of your ability) the CI/CD logical pipeline in Lucid Charts

[CI/CD Logical Diagram Lucid Link](https://lucid.app/lucidchart/9f850bf7-19aa-49e5-a988-45324e5e6ac7/edit?view_items=C2hyuKXkKhQI&invitationId=inv_a3882301-a812-4ca9-9c76-822b1c0d9ffd)
![CI/CD Diagram](assests/week0/Cruddur%20CI_CD%20Logical%20Diagram.png)
