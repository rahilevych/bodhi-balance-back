# 🧘‍♀️ Bodhi Balance - Backend

Welcome to the repository for the **backend part** of the **Bodhi Balance** yoga studio website.

This service a RESTful API built to manage user data, authentication, and core business logic for the application.

<p align="left">
  <a href="https://bodhi-balance-8ucr.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-🚀-blue?style=for-the-badge&logo=vercel" alt="Live Demo">
  </a>
  <a href="https://github.com/rahilevych/bodhi-balance" target="_blank">
    <img src="https://img.shields.io/badge/Frontend_Repo-⚙️-lightgrey?style=for-the-badge&logo=github" alt="Frontend">
  </a>
</p>

> [!NOTE]
> The backend is hosted on a free Render instance. If the site feels slow to load initially, please wait a little bit for the server to "wake up" from its sleep state. Sometimes a manual page reload helps once the server is active.
---

## 📝 API Endpoints

| Method | Endpoint | 
| :--- | :--- |
| `POST` | `/auth/register` | User registration. |
| `POST` | `/auth/login` | User login (returns JWT token). |
| `POST` | `/auth/logout` | User logout |
| `GET` | `/auth/me` | Get user profile |
| `POST` | `/booking/training` | Book a training |
| `PATCH` | `/booking/training/cancel` | Cancel a training |
| `GET` | `/booking/bookings` | Get a list of trainings|
| `GET` | `/yoga/styles` | Get a list of yoga styles|
| `PUT` | `/users/:id` | Update user|
| `DELETE` | `/users/delete` | Delete user|
| `GET` | `/schedule/trainings` | Get trainings for date|
| `GET` | `/schedule/trainings/training/:id` | Get training|
| `GET` | `/subscription/active` | Get user's subscription|
| `POST` | `/subscription/buy` | Buy subscription|
| `GET` | `/questions/all` | Get all questions|
| `GET` | `/plans/all` | Get all plans|
| `GET` | `/plans/all/:id` | Get plan by id|
| `POST` | `/contact/message` | Send contsct message|

---

## 🧰 Technologies

The API is built using the **MERN stack** technologies for the backend, focusing on efficiency and asynchronous operations.

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Runtime Environment** | **Node.js** | 
| **Web Framework** | **Express.js** | 
| **Database** | **MongoDB** |
| **Authentication** | **JWT (JSON Web Tokens)** |
| **Language** | **JavaScript** |
| **Scheduling** | **node-cron** |

---

## ✅ Key Features Implemented

The following core functionalities and architectural solutions were implemented in the API:

* **User Authentication:** Implemented secure user sign-up and sign-in using **JWT tokens** for access management.
* **RESTful API:** Developed **RESTful API routes** to facilitate interaction with the database.
* **Database Operations (CRUD):** Established database connections and implemented **CRUD operations** for multiple essential data types (e.g., users, courses, bookings).
* **Input Validation:** Ensured data integrity and security through **input validation** using `express-validator`.
* **Error Handling:** Setup **global error handling middleware** to catch and standardize all request errors, providing consistent responses.
* **Scheduled Jobs:** Defined and managed recurring background tasks using the **node-cron** package for automated maintenance or notifications.

---

## 🏗️ Code Structure

The project adheres to a **layered architecture** pattern for maximum modularity and testability.

| Folder | Purpose |
| :--- | :--- |
| `routes` | Defines the API endpoints and directs requests to the appropriate controller. |
| `controllers` | Handles incoming HTTP requests, performs basic validation, and calls the relevant service layer function. |
| `services` | Contains the core business logic and acts as the **DB access layer** (abstracting direct database interaction). |
| `models` | Defines the database schemas and validation rules (using Mongoose/MongoDB). |
| `middleware` |  middleware functions, such as **authentication checks** (`auth`) and **error handling**. |
| `config` | Stores application configurations (e.g., database URI, JWT secret keys). |
| `utils` | Provides general utility functions that are reusable across the application. |
| `cron` | Contains logic for defining and managing recurring background jobs using `node-cron`. |

---

## 🚀 Getting Started

To run the project locally, please follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rahilevych/bodhi-balance-back
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and define necessary variables
4.  **Run the Server:**
    ```bash
    npm start
    # or
    node server.js 
    ```
    The API will typically be running on `http://localhost:5000` (or the port defined in your configuration).

