# 📦 Subscription Tracker API

A **production-grade REST API** for managing user subscriptions (Netflix, Spotify, etc.) built using **Node.js, Express, and MongoDB Atlas**. This system features automated email reminders via **Upstash Workflows**, multi-layer security via **Arcjet**, and a professional error-handling architecture.

---

## 🧠 Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Security:** Arcjet (Bot Detection, Rate Limiting, Shield)
- **Automation:** Upstash QStash & Workflows
- **Email:** Nodemailer (Gmail SMTP)

---

## 📁 Project Structure

```text
subscription-tracker/
├── config/
│   ├── env.js             # Environment variables validation
│   ├── arcjet.js          # Security rules (Bot/Rate limit)
│   └── upstash.js         # Workflow client setup
├── controllers/
│   ├── auth.controller.js  # SignUp, SignIn
│   ├── subscription.controller.js
│   └── workflow.controller.js     # Renewal logic
├── database/
│   └── mongodb.js         # Atlas connection logic
├── middlewares/
│   ├── auth.middleware.js # JWT verification
│   ├── arcjet.middleware.js# Security layer
│   └── error.middleware.js # Global error handler
├── models/
│   ├── user.model.js
│   └── subscription.model.js # Auto-calculates renewal dates
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── subscription.routes.js
│   └── workflow.routes.js
├── .env.development.local
├── app.js                 # Entry point
└── package.json

```

---

## ⚙️ Step-by-Step Setup

### 1. Clone & Install

```bash
git clone https://github.com/vishalkumar321/Subscription-Tracker-API.git
cd Subscription-Tracker-API
npm install

```

### 2. MongoDB Atlas Setup (Cloud Database)

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Shared Cluster** (Free).
3. Go to **Network Access** -> **Add IP Address** -> Select "Allow Access from Anywhere".
4. Go to **Database Access** -> Create a user with a username and password.
5. Click **Connect** -> **Drivers** -> Copy the `SRV` connection string.

### 3. Upstash & Arcjet Setup

- **Arcjet:** Sign up at [Arcjet](https://arcjet.com). Create a new site and copy your `ARCJET_KEY`.
- **Upstash:** Sign up at [Upstash](https://upstash.com). Create a **QStash** instance and copy the `QSTASH_URL` and `QSTASH_TOKEN`.

### 4. Configure Environment Variables

Create `.env.development.local` in the root:

```env
PORT=5500
NODE_ENV=development

# Database (Paste your Atlas SRV string here)
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sub-tracker

# JWT
JWT_SECRET=your_random_secret_key
JWT_EXPIRES_IN=7d

# Arcjet Security
ARCJET_KEY=ajkey_xxxxxxxx

# Upstash Workflows
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your_token
SERVER_URL=http://localhost:5500 # Update this when using Ngrok

# Email (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop

```

---

## 🚀 Key Features

### 🔐 Multi-Layer Security

Protected by **Arcjet**, the API includes:

- **Bot Detection:** Blocks automated scrapers.
- **Rate Limiting:** Prevents brute-force attacks on login.
- **Shield:** Protects against SQL Injection and XSS.

### 🔁 Automated Renewal Reminders

The system uses **Upstash Workflows** to manage background jobs. When a subscription is created, the workflow schedules reminders:

- **7 Days Before:** Initial "Heads up" email.
- **3 Days Before:** Final "Action required" email.

> ⚠️ **Local Testing Tip:** Since Upstash is a cloud service, it cannot "see" your `localhost`. To test workflows locally, use **Ngrok**:
>
> 1. Run `ngrok http 5500`
> 2. Copy the `https://...` URL provided.
> 3. Update `SERVER_URL` in your `.env` with that Ngrok URL.

### 📧 Email Configuration

1. Enable **2-Step Verification** on your Gmail account.
2. Go to **App Passwords** in Google Security settings.
3. Generate a code for "Mail" on your "Windows/Mac" device.
4. Use that 16-character code in your `.env`.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| `POST` | `/api/v1/auth/sign-up` | Register User     |
| `POST` | `/api/v1/auth/sign-in` | Login & Get Token |

### Subscriptions (Requires Bearer Token)

| Method | Endpoint                         | Description            |
| ------ | -------------------------------- | ---------------------- |
| `POST` | `/api/v1/subscriptions`          | Create Subscription    |
| `GET`  | `/api/v1/subscriptions/user/:id` | Get User Subscriptions |
| `GET`  | `/api/v1/subscriptions/:id`      | Get Specific Sub       |

---

## ▶️ Running the App

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start

```

---

## ✅ Common Troubleshooting

- **Error: "Arcjet key missing":** Ensure your `.env.development.local` file is in the root directory and the key is correct.
- **Emails not sending:** Ensure your Gmail App Password is correct and you are not using your regular login password.
- **Database connection fail:** Ensure you whitelisted `0.0.0.0/0` in MongoDB Atlas Network Access.
