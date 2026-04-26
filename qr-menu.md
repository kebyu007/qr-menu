# 🍽 QR Menu + Feedback System

## 📌 Overview

This project simulates a real-world restaurant system where:

- Restaurant owners manage menus
- Customers view menus via QR (public access)
- Customers submit feedback or complaints
- System includes authentication, OTP, email, logging, and middleware

---

## 🎯 Objective

Build a full-stack application using:

- Node.js (Express)
- MongoDB (Mongoose)
- HBS or EJS (View Engine)

You must implement authentication, validation, logging, and real-world flows.

---

## ⚙️ Tech Requirements

- Express.js
- MongoDB + Mongoose
- JOI (validation)
- JWT (access + refresh tokens)
- Bcrypt (password hashing)
- Nodemailer (email sending)
- Winston (logging)
- Optional: Telegram Bot / OTP

---

## 👤 Roles

### 1. Admin (Restaurant Owner)
- Logs in
- Manages menu
- Views feedback

### 2. Customer
- Registers and logs in
- Sends feedback or complaint

### 3. Viewer (Public User)
- Views menu (NO LOGIN required)

---

## 🔐 Authentication

### Required:
- Register
- Login
- JWT Access Token
- Refresh Token
- Password hashing (bcrypt)

### Bonus:
- Email verification

---

## 📂 Database Models

### User
- name
- email (unique)
- password
- role (admin)

### Category
- name
- user_id

### Product
- name
- price
- category_id
- image (optional)

### Feedback
- message
- type (review / complaint)
- image (optional)
- device_info
- created_at

---

## 📡 API Requirements

### 🔐 Auth

- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/refresh`

---

### 📂 Categories

- POST `/categories` (admin only)
- GET `/categories`

---

### 🛍 Products

- POST `/products` (admin only)
- GET `/products`
- GET `/products?category_id=...`

---

### 💬 Feedback

- POST `/feedback`
- GET `/feedback` (admin only)

---

## 🧠 Validation (JOI)

All endpoints must validate input:
- Required fields
- Email format
- Password length

---

## 🛡 Middleware

You MUST implement:

- Auth middleware (JWT verification)
- Role-based guard (admin only)
- Error handling middleware

---

## 📧 Email

When a new complaint is created:
- Send email to admin

---

## 📱 OTP (Optional but recommended)

- Send OTP via Telegram or mock
- Use OTP for:
  - Feedback verification OR login

---

## 🧠 Device Detection

- Capture device info from headers
- Save in feedback

---

## 📊 Logging (Winston)

Log:
- Errors
- Feedback submissions
- Login attempts

Use:
- Winston
- Winston-MongoDB

---

## 🖥 Frontend (HBS/EJS)

### Pages Required:

- Login/Register
- Admin Dashboard
- Menu Page (public)
- Feedback Form

---

## 🚨 Error Handling

- Centralized error handler
- Proper HTTP status codes
- Meaningful error messages

---

## 📁 Project Structure (Recommended)

```
src/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
├── validators/
├── utils/
└── views/
```

---

## ✅ Minimum Requirements

- Auth (JWT + bcrypt)
- CRUD (categories, products)
- Feedback system
- JOI validation
- Middleware (auth + role)
- Error handling
- Logging (Winston)

---

## ⭐ Bonus Features

- OTP verification
- Email confirmation
- Image upload
- Telegram integration

---

## ⏳ Time Limit

2 days

---

## 📊 Evaluation Criteria

### Backend (70%)
- Correct auth flow
- Clean architecture
- Proper validation
- Middleware usage

### Frontend (15%)
- Working pages
- Proper rendering

### Advanced (15%)
- OTP
- Logging
- Email

---

## 🚀 Submission

- GitHub repository
- README included
- `.env.example` file

---

Good luck! 🚀