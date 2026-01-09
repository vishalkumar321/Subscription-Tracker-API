```md
# 📦 Subscription Tracker API

A **production-grade REST API** for managing user subscriptions (Netflix, Spotify, etc.) built with **Node.js, Express, MongoDB**, secured using **Arcjet**, automated with **Upstash Workflow**, and supporting **email notifications** via **Gmail App Passwords**.

This README is **self-sufficient**.
If someone follows it step by step, they can build the entire project **without any external resource**.

---

## 🧠 Tech Stack

- Node.js (ES Modules)
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Arcjet (security, bot detection, rate limiting)
- Upstash QStash + Workflow
- Nodemailer (Gmail App Password)
- dotenv

---

## 📁 Folder Structure
```

subscription-tracker/
│
├── config/
│ ├── env.js
│ ├── arject.js
│ └── upstash.js
│
├── controllers/
│ ├── auth.controller.js
│ ├── subscription.controller.js
│ └── workflow.controller.js
│
├── database/
│ └── mongodb.js
│
├── middlewares/
│ ├── auth.middleware.js
│ ├── arject.middleware.js
│ └── error.middleware.js
│
├── models/
│ ├── user.model.js
│ └── subscription.model.js
│
├── routes/
│ ├── auth.routes.js
│ ├── user.routes.js
│ ├── subscription.routes.js
│ └── workflow.routes.js
│
├── .env.development.local
├── .env.production.local
├── app.js
├── package.json
└── README.md

````

---

## ⚙️ Project Setup (Step by Step)

### 1️⃣ Clone & Install

```bash
git clone <repo-url>
cd subscription-tracker
npm install
````

---

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

```text
mongodb://127.0.0.1:27017/subscription-tracker
```

### Option 2: MongoDB Atlas

- Create cluster
- Copy connection string
- Use it as `DB_URI`

---

## 🔐 Environment Variables

Create this file:

### `.env.development.local`

```env
NODE_ENV=development
PORT=5500

DB_URI=mongodb://127.0.0.1:27017/subscription-tracker

JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d

SERVER_URL=http://localhost:5500

ARCJET_KEY=your_arcjet_key_here

QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your_qstash_token_here

EMAIL_PASSWORD=your_gmail_app_password
```

> All environment variables are **strings**. This is expected.

---

## 🔐 Authentication (JWT)

- User logs in / signs up
- JWT is generated
- Token must be sent in headers

### Required Header

```
Authorization: Bearer <JWT_TOKEN>
```

Used for:

- Creating subscriptions
- Fetching user subscriptions
- Protected routes

---

## 🛡️ Arcjet Security

### What Arcjet Handles

- Bot detection
- Rate limiting
- XSS / SQLi protection

### Important Rules

- DRY_RUN in development
- LIVE in production
- **No invalid categories**

### Valid Bot Categories Used

- CATEGORY:SEARCH_ENGINE
- CATEGORY:AI
- CATEGORY:MONITORING

> Arcjet warnings about `127.0.0.1` in development are normal.

---

## 📬 Email Sending (Gmail App Password)

### Why App Password?

Gmail blocks normal passwords for Nodemailer.

### Steps

1. Enable **2-Step Verification** in Google Account
2. Go to **Security → App Passwords**
3. Create password for:

   - App: Mail
   - Device: Other

4. Copy password

Add to `.env`:

```env
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

---

## 🔁 Upstash Workflow & QStash

### Purpose

- Background jobs
- Email reminders
- Retry-safe workflows

### Critical Rule

> ❌ Upstash **cannot call localhost**

### Correct Usage

```js
if (NODE_ENV === "production") {
  workflowClient.trigger(...)
}
```

- Local development → workflow skipped
- Production → workflow executed

---

## 📦 Subscription Model Behavior

- `renewalDate` auto-calculated from `frequency`
- `status` auto-updated to `expired` if renewal date < today

### Example Request Body

```json
{
  "name": "Netflix Premium",
  "price": 649,
  "currency": "INR",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "Credit Card",
  "startDate": "2026-01-01"
}
```

---

## 📡 API Endpoints

### Auth

```
POST /api/v1/auth/register
POST /api/v1/auth/login
```

---

### Subscriptions

#### Create Subscription

```
POST /api/v1/subscriptions
Authorization: Bearer <JWT>
```

#### Get User Subscriptions

```
GET /api/v1/subscriptions/user/:userId
Authorization: Bearer <JWT>
```

> Token user ID must match URL user ID.

---

## ❌ Common Mistakes & Fixes

| Mistake                         | Result               |
| ------------------------------- | -------------------- |
| GET request with body           | body-parser error    |
| Using future startDate          | expired subscription |
| Calling workflow in dev         | fetch failed         |
| Using `next()` in Mongoose hook | crash                |
| Using invalid Arcjet category   | Arcjet error         |
| Wrong user ID in GET            | 403 Forbidden        |

---

## ▶️ Run the Project

```bash
npm run dev
```

Expected output:

```
Subscription Tracker API is running on http://localhost:5500
Connected to database in development mode
```

---

## ✅ Final Notes

- Fully secure backend architecture
- Clean separation of concerns
- Production-ready design
- Scales well for SaaS applications

---

## 🚀 Future Enhancements

- Upcoming renewals endpoint
- Subscription cancellation
- Pagination & filtering
- Admin access
- Frontend integration

```

```
