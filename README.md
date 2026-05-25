# Expense Tracker Web Application

## Project Description

Expense Tracker is a full-stack single-page web application that allows users to securely register, log in, and manage their personal expenses. Users can create, view, update, delete, and search expense records in real time. The application also includes an admin panel where admin users can manage user accounts and review activity logs.

The purpose of this application is to help users keep track of their spending in a simple and organised way while demonstrating modern frontend, backend, database, authentication, and CRUD functionality.

---

## Problem This Website Solves

Many people need a simple way to record and review their daily expenses. This application provides a streamlined platform where users can store their spending records, search through them quickly, and view their total spending. The admin panel also allows system administrators to manage users and monitor important account activity.

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- Mongoose
- bcryptjs
- JSON Web Token
- dotenv
- cors

### Database

- MongoDB Atlas

---

## Main Features

- User registration
- User login
- Password hashing with bcrypt
- JWT authentication
- Protected frontend routes
- Role-based admin access
- Create expense records
- Read expense records
- Update expense records
- Delete expense records
- Live search for expenses
- Total spending summary
- Admin view of all users
- Admin role management
- Admin user deletion
- User activity logs
- Responsive single-page application interface

---

## Database Entities

This application uses three main conceptual entities.

### 1. User

Stores account information for registered users.

Example fields:

- username
- email
- passwordHash
- role
- createdAt
- updatedAt

CRUD operations are used through registration, admin user viewing, role updating, and user deletion.

### 2. ExpenseItem

Stores expense records created by users.

Example fields:

- user
- title
- amount
- category
- date
- notes
- createdAt
- updatedAt

CRUD operations are used when users create, view, update, and delete their expenses.

### 3. UserActivity

Stores important user actions for admin review.

Example fields:

- user
- action
- details
- createdAt
- updatedAt

Activity records are created when users register, log in, and perform expense or admin actions.

---

## Folder Structure

```txt
expense-tracker-assignment/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── ExpenseItem.js
│   │   └── UserActivity.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── adminRoutes.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Admin.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   └── sample-data.json
│
├── README.md
└── .gitignore
```

---

## How to Run the Application

### 1. Clone the Repository

```bash
git clone https://github.com/danielmartinezvanegas/expense-tracker-assignment.git
cd expense-tracker-assignment
```
---

## Backend Setup

Go into the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

The backend should run at:

```txt
http://localhost:5001
```

---

## Frontend Setup

Open a second terminal and go into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend should run at:

```txt
http://localhost:5173
```

---

## Environment Variables

The backend requires the following environment variables:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

The `.env` file is not included in the GitHub repository for security reasons.

---

## Test Account Details

Example admin account used during development:

```txt
Email: daniel@test.com
Password: password123
Role: admin
```

Example standard user account:

```txt
Email: user@test.com
Password: password123
Role: user
```

Note: User passwords are hashed in the database and are not stored as plain text.

---

## API Overview

### Authentication Routes

```txt
POST /api/auth/register
POST /api/auth/login
```

### Expense Routes

```txt
GET /api/expenses
POST /api/expenses
PUT /api/expenses/:id
DELETE /api/expenses/:id
```

### Admin Routes

```txt
GET /api/admin/users
GET /api/admin/activities
PUT /api/admin/users/:id
DELETE /api/admin/users/:id
```

---

## Security Features

- Passwords are hashed using bcrypt before being stored.
- JWT tokens are used for authentication.
- Protected routes prevent unauthenticated users from accessing private pages.
- Admin-only middleware prevents normal users from accessing admin routes.
- Sensitive data such as database connection strings and JWT secrets are stored in `.env` and excluded from GitHub.
- Server-side validation prevents invalid expense data such as negative amounts, empty titles, invalid categories, invalid dates, and overly long notes.

---

## Database Export / Sample Data

A sample MongoDB-style JSON file is included in:

```txt
database/sample-data.json
```

This file provides example users, expense items, and user activity logs without exposing sensitive information such as real passwords or database credentials.

---

## Workload Allocation

This project was completed individually.

All frontend development, backend development, database design, authentication, styling, testing, documentation, GitHub repository management were completed by Daniel Martinez.

---

## Author

Daniel Martinez
