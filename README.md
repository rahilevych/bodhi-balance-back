# 🧘‍♀️ Bodhi Balance 
This is the backend part of a yoga studio web site Bodhi Balance built with Node.js, Express.js, and MongoDB.

## 🧰 Technologies
- Node.js
- Express.js
- MongoDB
- JWT token

## 🏗️ Code Structure
The project follows a layered architecture and includes the following folders:

- controllers: handle incoming requests, call services
- models: database models
- services: contains business logic and handles interaction with the database (DB access layer)
- routes: API endpoints
- middleware: middleware functions(e.g., auth,error handling)
- config: configuration functions
- utils: utility functions
- cron: defines and manages recurring background jobs using the node-cron package

## ✅ What I Implemented
- user authentication using JWT tokens
- nput validation using express-validator
- global error handling middleware for all request errors
- RESTful API routes for interacting with MongoDB
 -database connections and CRUD operations for multiple data types

