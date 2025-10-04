# Expense Management System - Hackathon Submission

This is a full-stack web application built to solve the Expense Management problem statement. The system provides a streamlined, transparent, and efficient way for employees to submit expense claims and for managers to approve them.

---

## Core Features Implemented

* **User Authentication:** Secure registration and login system using JSON Web Tokens (JWT).
* **Role-Based Access:** Initial implementation of Admin, Manager, and Employee roles.
* **Expense Submission:** Employees can submit detailed expense claims, including amount, currency, category, and date.
* **Manager Approval Workflow:**
    * Managers can view a dashboard of all expenses pending their approval.
    * Managers can approve or reject claims with comments.
* **Live Currency Conversion:** Utilizes an external API to convert all expense amounts to the manager's company's default currency for easy viewing.

---

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Frontend:** React (with Vite)
* **Authentication:** JWT (jsonwebtoken), bcryptjs
* **API Client:** Axios

---

## How to Set Up and Run

### Backend

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the `backend` root and add your variables:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
4.  Start the server: `npm start`
    * The server will run on `http://localhost:5000`.

### Frontend

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the client: `npm run dev`
    * The application will be available at `http://localhost:5173`.