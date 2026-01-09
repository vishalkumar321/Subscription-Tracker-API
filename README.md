```md
# 📦 Subscription Tracker API

A **production-grade REST API** for managing user subscriptions (Netflix, Spotify, etc.) built using **Node.js, Express, MongoDB**, secured with **Arcjet**, automated using **Upstash Workflow**, and supporting **email notifications** via **Gmail App Password**.

This README is **complete and standalone**.
Anyone can build the **entire project from scratch** by following the steps below — **no external resources required**.

---

# 🧠 Tech Stack

- **Node.js** (ES Modules)
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Arcjet** (Bot detection, rate limiting, security)
- **Upstash QStash + Workflow**
- **Nodemailer** (Gmail App Password)
- **dotenv**

---

# 📁 Project Folder Structure
```

```text
subscription-tracker/
│
├── config/
│ ├── env.js # Environment variable loader
│ ├── arject.js # Arcjet security configuration
│ └── upstash.js # Upstash QStash / Workflow client
│
├── controllers/
│ ├── auth.controller.js
│ ├── subscription.controller.js
│ └── workflow.controller.js
│
├── database/
│ └── mongodb.js # MongoDB connection logic
│
├── middlewares/
│ ├── auth.middleware.js # JWT authorization middleware
│ ├── arject.middleware.js # Arcjet middleware
│ └── error.middleware.js # Global error handler
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
```

````

---

# ⚙️ Step-by-Step Project Setup

---

## 1️⃣ Clone Repository & Install Dependencies

```bash
git clone <repository-url>
cd subscription-tracker
npm install
````

---

## 2️⃣ MongoDB Setup (Database)

### Option A — Local MongoDB

```text
mongodb://127.0.0.1:27017/subscription-tracker
```

### Option B — MongoDB Atlas

1. Create MongoDB Atlas account
2. Create a cluster
3. Copy connection string
4. Use it as `DB_URI`

---

# 🔐 Environment Variables Setup

Create the following file:

## `.env.development.local`

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

> ⚠️ All environment variables are **strings** — this is correct behavior.

---

# 🔐 Authentication (JWT)

### How Authentication Works

1. User registers or logs in
2. Server generates JWT token
3. Client sends token in headers for protected routes

### Required Header

```
Authorization: Bearer <JWT_TOKEN>
```

Used for:

- Creating subscriptions
- Fetching user subscriptions
- Any protected endpoint

---

# 🛡️ Arcjet Security Configuration

### What Arcjet Protects

- Bot detection
- Rate limiting
- XSS & SQL injection protection

### Important Rules

- **DRY_RUN** mode in development
- **LIVE** mode in production
- Only valid bot categories allowed

### Valid Categories Used

- `CATEGORY:SEARCH_ENGINE`
- `CATEGORY:AI`
- `CATEGORY:MONITORING`

> ⚠️ Arcjet warnings about `127.0.0.1` in development are **normal and safe**.

---

# 📬 Email Sending (Gmail App Password)

### Why Gmail App Password?

Gmail blocks direct password access for Nodemailer.

### Steps to Generate App Password

1. Enable **2-Step Verification** in Google Account
2. Go to **Security → App Passwords**
3. Create new password:

   - App: Mail
   - Device: Other (Node App)

4. Copy the generated password

Add it to `.env`:

```env
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

---

# 🔁 Upstash Workflow & QStash

### Purpose

- Background jobs
- Email reminders
- Retry-safe workflows

### Critical Rule (Very Important)

> ❌ **Upstash cannot call localhost**

### Correct Usage

```js
if (NODE_ENV === "production") {
  workflowClient.trigger(...)
}
```

- Development → workflow skipped
- Production → workflow executed

---

# 📦 Subscription Model Logic

### Automatic Behavior

- `renewalDate` auto-calculated using `frequency`
- `status` becomes `expired` if renewal date < today

### Example Subscription Request Body

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

# 📡 API Endpoints

---

## 🔐 Auth Routes

```
POST /api/v1/auth/register
POST /api/v1/auth/login
```

---

## 📦 Subscription Routes

### Create Subscription

```
POST /api/v1/subscriptions
Authorization: Bearer <JWT>
```

### Get User Subscriptions

```
GET /api/v1/subscriptions/user/:userId
Authorization: Bearer <JWT>
```

> ⚠️ Token user ID **must match** the URL user ID.

---

# ❌ Common Mistakes & Fixes

| Mistake                         | Result               |
| ------------------------------- | -------------------- |
| GET request with body           | body-parser crash    |
| Future startDate                | expired subscription |
| Calling workflow in dev         | fetch failed         |
| Using `next()` in Mongoose hook | runtime error        |
| Invalid Arcjet category         | Arcjet error         |
| Wrong user ID                   | 403 Forbidden        |

---

# ▶️ Run the Project

```bash
npm run dev
```

Expected output:

```
Subscription Tracker API is running on http://localhost:5500
Connected to database in development mode
```

---

# ✅ Final Notes

- Clean, scalable backend architecture
- Security, workflows, and validation handled correctly
- Ready for production use
- Ideal foundation for SaaS applications

---

# 🚀 Future Enhancements

- Upcoming renewals endpoint
- Subscription cancellation
- Pagination & filters
- Admin dashboard
- Frontend integration

```

```
