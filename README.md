<div align="center">

# 🏍️ WheelsOnRoad | ApexLease 🚗

### Premium Superbike & Supercar Rental Platform

A full-stack MERN application delivering a sleek, dark-themed rental experience — from real-time fleet availability to secure UPI checkout — backed by a robust admin control center.

[![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React.js-Frontend-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express.js-Backend-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat)]()

</div>

---

## 📖 Overview

**WheelsOnRoad** (internally codenamed **ApexLease**) is a production-style, full-stack MERN platform built for renting high-performance superbikes and supercars. It combines a premium customer-facing booking flow with a secure, role-gated admin dashboard — engineered to handle concurrent bookings, dynamic pricing, and real-world payment workflows without double-booking or race conditions.

This project was built to demonstrate practical, production-grade engineering: real-time concurrency control, RBAC-secured APIs, dynamic pricing logic, and a polished UI — not just CRUD.

---

## 🌟 Key Features

### For Renters
| Feature | Description |
|---|---|
| 🏎️ **Premium Fleet Browsing** | Search and filter an extensive catalog of superbikes and supercars |
| ⚡ **Real-Time Availability** | Atomic collision checks + Socket.io locks prevent double-booking |
| 💰 **Dynamic Pricing Engine** | Automatic weekday/weekend surge rates and multi-day discounts |
| 🔐 **Seamless Checkout** | Detailed price breakdown with secure UPI QR-based payments |
| 📊 **My Dashboard** | Track active, pending, and past rides in one place |

### For Fleet Administrators
| Feature | Description |
|---|---|
| 📈 **Live Dashboard** | Real-time overview of revenue, active rides, and pending approvals |
| 🚘 **Inventory Management** | Full CRUD for fleet vehicles directly from the UI |
| ✅ **Booking Management** | Approve, confirm, activate, or cancel bookings end-to-end |
| 🧾 **Dynamic Payment Settings** | Update UPI ID, instructions, and QR code without touching code |
| 🛡️ **Secure Access Control** | JWT-based Role-Based Access Control (RBAC) on every admin route |

---

## 🛠️ Tech Stack

**Frontend** — React.js · Context API (state management) · Axios · Lucide-React (icons) · Vanilla CSS (Dark/Orange theme)

**Backend** — Node.js · Express.js

**Database** — MongoDB Atlas (Mongoose ODM)

**Auth & Security** — JSON Web Tokens (JWT) · bcrypt password hashing

**Real-Time** — Socket.io (concurrent booking locks)

**File Handling** — Multer (vehicle images, payment QR uploads)

---

## 🏗️ Architecture Highlights

- **Atomic Booking Locks** — Concurrent booking attempts on the same vehicle/date range are resolved with Socket.io-driven locks and atomic database checks, eliminating race conditions.
- **Role-Based Access Control** — Every admin route is protected by JWT middleware that verifies both authentication and role, so customer accounts can never touch inventory or booking-management endpoints.
- **Dynamic Pricing Layer** — Pricing rules (weekday/weekend surge, multi-day discounts) are computed server-side at booking time, keeping pricing logic centralized and tamper-resistant.
- **Config-Driven Payments** — UPI ID, instructions, and QR code are stored in the database and editable by admins at runtime — no redeploys needed to update payment details.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- A MongoDB Atlas cluster (with your IP whitelisted)

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/wheelsonroad.git
cd wheelsonroad
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `backend/.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. (Optional) Seed the Database
Populate your fleet with 100 superbikes and 100 supercars:
```bash
cd backend
node seedVehicles.js
```

---

## 📂 Project Structure

```
wheelsonroad/
├── admin/                   # Standalone admin dashboard (Vite + React)
│   ├── public/
│   ├── src/
│   ├── .eslintrc.cjs
│   ├── vite.config.js
│   └── package.json
├── backend/                 # Express API + Socket.io server
│   ├── src/
│   ├── uploads/              # Multer file storage (vehicle images, QR codes)
│   ├── seedVehicles.js       # Fleet seeder script
│   ├── server.js
│   └── package.json
├── frontend/                 # Customer-facing React app
│   ├── build/
│   ├── public/
│   ├── src/
│   └── package.json
└── README.md
```

---

## 📸 Demo

<div align="center">

| Fleet Browsing | Booking Flow |
|---|---|
| ![Fleet browsing screenshot](./docs/screenshots/fleet-browsing.png) | ![Booking flow screenshot](./docs/screenshots/booking-flow.png) |

| Admin Dashboard | UPI Checkout |
|---|---|
| ![Admin dashboard screenshot](./docs/screenshots/admin-dashboard.png) | ![UPI checkout screenshot](./docs/screenshots/upi-checkout.png) |

</div>

> Add your own screenshots to a `docs/screenshots/` folder in the repo and update the paths above. A short screen-recording GIF of the booking flow works even better than static images here.

---

## 🔒 Security Notes

- `MONGO_URI` and `JWT_SECRET` must never be committed to version control — use `.env` and `.gitignore`.
- Passwords are hashed with bcrypt before storage; plaintext passwords are never persisted.
- All admin routes are protected by JWT + RBAC middleware, blocking non-admin access to inventory and reservation data.

---

## 📄 License

This project is **proprietary** and built specifically for the WheelsOnRoad premium mobility platform. All rights reserved.

---

<div align="center">

Built with ⚙️ MERN and a lot of attention to concurrency edge cases.

</div>
