# Serverless image sharing App

Udacity Cloud Developer NanoDegree Capstone Project

The backend is a set of RESTful API built using serverless framework, then automatically deploy to AWS resources include APIGateway, Lambda and DynamoDB.

The frontend client is developed using REACT and Semantic UI

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Client

### Configure

The Client application uses Auth0 to authenticate with the service. Therefore you need to create an [Auth0 account](https://auth0.com/) and afterwards a new application.

To have a connection to the backend, provide the `apiId` and Auth0 configuration in the config file.

```
// client/src/config.ts

const apiId = '' // AWS apiId created by Serverless framework
const auth0Domain = '' // Domain of your Auth0 account
const auth0ClientId = '' // ClientId of your Auth0 application
```

### Run

To run the React client run the following command inside the `client` directory. This will start a development server.

```
npm start

  // or

yarn start
```



# Features

 - AWS x-ray is implemented to trace the system
 - Winston is implemented for logging
 - The system can be tested offline by emulating DynamoDB and serverless

### Authentication

User need to login and properly authenticated to access the content of this application. 

Auth0 is used to handle the authentication.

### Ownership

User can create collections, upload images to different collections. User can delete individual image or a collection along with the images belong to this collection.

### Discovery

User can browser other user's content in the Discover page.

User can save the images to view them later. User can remove images in the saved images page.


