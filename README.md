# OTP Based User Login & Checkout System

A full-stack web application that provides user registration, OTP-based login, user recognition, and checkout functionality.

## Live Application

**Frontend:** https://otp-login-project-1.onrender.com

**Backend API:** https://otp-login-project-i2wt.onrender.com

## GitHub Repository

https://github.com/Priyankamaurya-coder/OTP_Login_Project

## Project Overview

This project implements an OTP-based user recognition and login flow.

A new user can register using their email, first name, and last name. After successful registration, a random 6-digit numeric code is generated and displayed to the user.

When a registered user enters their email during checkout, the system recognizes the user and displays an OTP login modal. The user can enter the correct code to log in or skip login and continue with checkout.

The checkout form collects the user's email, phone number, and shipping address and stores the submitted information in the database.

## Features

### Registration

* Register using email, first name, and last name
* Validate required fields
* Generate a random 6-digit numeric code
* Display the generated code after registration

### User Recognition & Login

* Real-time email format validation
* Check whether an email belongs to a registered user
* Recognize registered users while filling the checkout form
* Display an OTP login modal
* Verify the 6-digit OTP
* Show an error for incorrect or expired OTP
* Option to skip login
* Display the logged-in user's name

### Checkout

* Collect email
* Collect phone number
* Collect shipping address
* Submit checkout information
* Store checkout information in the database
* No payment processing

## Technology Stack

### Frontend

* React.js
* JavaScript
* HTML
* CSS
* Vite

### Backend

* Python
* Django
* Django REST Framework
* django-cors-headers

### Database

* PostgreSQL

### Deployment

* Render

## Project Structure

```text
OTP_Login_Project/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── accounts/
│   ├── backend/
│   ├── manage.py
│   ├── database_schema.sql
│   ├── requirements.txt
│   └── Procfile
│
├── prompts.md
├── .gitignore
└── README.md
```

## API Endpoints

| Method | Endpoint                | Purpose                                             |
| ------ | ----------------------- | --------------------------------------------------- |
| POST   | `/api/register/`        | Register a new user and generate a 6-digit code     |
| POST   | `/api/recognize-user/`  | Check whether an email belongs to a registered user |
| POST   | `/api/verify-otp/`      | Verify the OTP code                                 |
| POST   | `/api/send-otp/`        | Generate an OTP for a phone number                  |
| POST   | `/api/submit-checkout/` | Store checkout information                          |

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Priyankamaurya-coder/OTP_Login_Project.git
cd OTP_Login_Project
```

### 2. Backend Setup

Open a terminal inside the `backend` folder:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows CMD:**

```cmd
venv\Scripts\activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Run database migrations:

```bash
python manage.py migrate
```

Start the Django server:

```bash
python manage.py runserver
```

Backend will run at:

```text
http://127.0.0.1:8000/
```

### 3. Frontend Setup

Open another terminal inside the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```text
http://localhost:5173/
```

## Database

The deployed application uses PostgreSQL.

The database schema is included in:

```text
backend/database_schema.sql
```

## Deployment

The application is deployed using Render.

* **Frontend:** Render Static Site
* **Backend:** Render Web Service
* **Database:** Render PostgreSQL

## Project Files

### `prompts.md`

Contains the prompts used with an LLM during the development of the project.

### `database_schema.sql`

Contains the database schema used by the project.
