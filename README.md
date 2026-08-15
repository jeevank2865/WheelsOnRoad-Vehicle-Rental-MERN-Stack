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

## Project Description

**WheelsOnRoad** (internally codenamed **ApexLease**) is a production-style, full-stack MERN platform built for renting high-performance superbikes and supercars. It offers a premium, dark-themed booking experience for customers alongside a secure, role-gated control center for fleet administrators.

The platform is engineered around a real problem in rental systems: **preventing double-bookings under concurrent demand**. Every booking request passes through atomic database checks combined with Socket.io-driven locks, so two customers can never reserve the same vehicle for overlapping dates — even when they hit "Book Now" at the same moment.

Beyond availability, the system computes **dynamic pricing** (weekday/weekend surge rates, multi-day discounts) server-side at booking time, and settles payments through a **UPI QR-based checkout** that admins can reconfigure — new UPI ID, instructions, or QR code — without a redeploy.

**Repository:** [WheelsOnRoad](#) *(replace with your GitHub repo link)*

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Security Notes](#security-notes)
- [Results](#results)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

WheelsOnRoad is split into three independent applications sharing one backend API:

- **Customer app (`frontend/`)** — browse the fleet, check real-time availability, and complete bookings with a full price breakdown and UPI checkout.
- **Admin app (`admin/`)** — a separate Vite + React dashboard for managing inventory, approving/cancelling bookings, and configuring payment settings.
- **Backend (`backend/`)** — an Express + Socket.io API backed by MongoDB Atlas, handling authentication, booking concurrency, pricing, and RBAC-protected admin operations.

This separation mirrors how real rental/fleet platforms are structured in production, with the admin surface fully decoupled from the customer-facing app.

---

## Features

### For Renters
- 🏎️ **Premium Fleet Browsing** — search and filter an extensive catalog of superbikes and supercars
- ⚡ **Real-Time Availability** — atomic collision checks + Socket.io locks prevent double-booking
- 💰 **Dynamic Pricing Engine** — automatic weekday/weekend surge rates and multi-day discounts
- 🔐 **Seamless Checkout** — detailed price breakdown with secure UPI QR-based payments
- 📊 **My Dashboard** — track active, pending, and past rides in one place

### For Fleet Administrators
- 📈 **Live Dashboard** — real-time overview of revenue, active rides, and pending approvals
- 🚘 **Inventory Management** — full CRUD for fleet vehicles directly from the UI
- ✅ **Booking Management** — approve, confirm, activate, or cancel bookings end-to-end
- 🧾 **Dynamic Payment Settings** — update UPI ID, instructions, and QR code without touching code
- 🛡️ **Secure Access Control** — JWT-based Role-Based Access Control (RBAC) on every admin route

---

## How It Works

**Booking Concurrency**
When a customer selects dates for a vehicle, the backend runs an atomic availability check against existing bookings for that date range. Simultaneously, a Socket.io lock is placed on the vehicle for the duration of the checkout flow, so a second customer attempting to book the same vehicle for overlapping dates is blocked in real time rather than discovering a conflict after payment.

**Dynamic Pricing**
Price is never trusted from the client. At booking time, the backend recalculates the total server-side: base rate → weekday/weekend surge adjustment → multi-day discount → final price. This keeps pricing logic centralized, consistent, and tamper-resistant.

**Role-Based Access Control**
Every admin route (inventory CRUD, booking status changes, payment settings) sits behind JWT middleware that checks both a valid token and an `admin` role claim. Customer accounts are rejected at the middleware layer before any controller logic runs.

**Payment Configuration**
UPI ID, checkout instructions, and the QR code image are stored in MongoDB rather than hardcoded, so admins can update payment details from the dashboard — no code changes or redeploys required.

---

## Tech Stack

**Frontend** — React.js · Context API (state management) · Axios · Lucide-React (icons) · Vanilla CSS (Dark/Orange theme)

**Backend** — Node.js · Express.js

**Database** — MongoDB Atlas (Mongoose ODM)

**Auth & Security** — JSON Web Tokens (JWT) · bcrypt password hashing

**Real-Time** — Socket.io (concurrent booking locks)

**File Handling** — Multer (vehicle images, payment QR uploads)

---

## Installation

### Prerequisites
- Node.js v16+
- A MongoDB Atlas cluster (with your IP whitelisted)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/wheelsonroad.git
cd wheelsonroad
```

### 2. Backend setup
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

### 3. Frontend setup
```bash
cd frontend
npm install
npm start
```

### 4. Admin dashboard setup
```bash
cd admin
npm install
npm run dev
```

### 5. (Optional) Seed the database
Populate your fleet with 100 superbikes and 100 supercars:
```bash
cd backend
node seedVehicles.js
```

---

## Usage

1. Start the **backend** (`npm run dev` inside `backend/`) — API runs on `http://localhost:5000`.
2. Start the **frontend** (`npm start` inside `frontend/`) — customer app opens in your browser.
3. Start the **admin app** (`npm run dev` inside `admin/`) — dashboard runs on its own Vite port.
4. **As a customer:** browse the fleet, pick a vehicle, select dates to see the live price breakdown, and complete checkout via the UPI QR flow.
5. **As an admin:** log in to the admin dashboard to add/edit/remove vehicles, approve or cancel booking requests, and update UPI payment settings.

---

## Project Structure

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

## Security Notes

- `MONGO_URI` and `JWT_SECRET` must never be committed to version control — use `.env` and `.gitignore`.
- Passwords are hashed with bcrypt before storage; plaintext passwords are never persisted.
- All admin routes are protected by JWT + RBAC middleware, blocking non-admin access to inventory and reservation data.

---

## Results

The platform successfully handles concurrent booking attempts on the same vehicle without double-booking, confirmed through manual race-condition testing with simultaneous requests. Dynamic pricing correctly applies weekend surge and multi-day discount rules at checkout, and the admin dashboard reflects booking status changes and inventory updates in real time.

**1. Customer Fleet Browsing & Booking Flow**

![Fleet browsing and booking flow screenshot](./docs/screenshots/fleet-browsing.png)

**2. Live Price Breakdown & UPI Checkout**

![UPI checkout screenshot](./docs/screenshots/upi-checkout.png)

**3. Admin Dashboard (Revenue, Active Rides, Approvals)**

![Admin dashboard screenshot](./docs/screenshots/admin-dashboard.png)

> Add your screenshots to a `docs/screenshots/` folder in the repo with matching filenames. A short screen-recording GIF of the booking flow works even better than static images here.

---

## Contributing

Contributions are welcome. To contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes and commit them
4. Push to your fork and submit a pull request

Future enhancements could include Razorpay/Stripe integration alongside UPI, a vehicle review & rating system, and automated email/SMS booking confirmations.

---

## License

This project is **proprietary** and built specifically for the WheelsOnRoad premium mobility platform. All rights reserved.

---

<div align="center">

Built with ⚙️ MERN and a lot of attention to concurrency edge cases.

</div>
