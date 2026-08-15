<div align="center">

# 🏍️ WheelsOnRoad 🚗

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

## 📌 Project Description

**WheelsOnRoad** (internally codenamed **ApexLease**) is a production-style, full-stack MERN platform built for renting high-performance superbikes and supercars.

The platform provides a premium dark-themed booking experience for customers along with a dedicated administrative control center for managing the rental fleet, bookings, users, and payment configuration.

The system is designed around a major real-world rental challenge:

> **Preventing double bookings when multiple customers attempt to reserve the same vehicle simultaneously.**

Every booking request passes through server-side availability validation and atomic database checks. Socket.io is also used to provide real-time vehicle locking during the booking process.

The platform also includes:

- Dynamic weekday/weekend pricing
- Multi-day rental discounts
- Real-time fleet availability
- JWT authentication
- Role-Based Access Control
- Admin fleet management
- Booking management
- UPI QR-based checkout
- MongoDB Atlas persistence
- Socket.io real-time communication

**Repository:** *Replace this with your GitHub repository link.*

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#️-tech-stack)
- [Installation](#-installation)
- [Usage](#️-usage)
- [Project Structure](#-project-structure)
- [Application Showcase & Results](#-application-showcase--results)
- [Complete Platform Architecture](#-complete-platform-architecture)
- [Security Notes](#-security-notes)
- [Results](#-results)
- [Contributing](#-contributing)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

## 🚀 Overview

WheelsOnRoad is divided into three major applications working together through a common backend API.

### 👤 Customer Application

Located inside `frontend/`

The customer application allows users to:

- Explore premium vehicles
- Search and filter the fleet
- View vehicle details
- Check availability
- Select rental dates
- View dynamic pricing
- Make bookings
- Complete UPI checkout
- Track bookings from their dashboard

### ⚙️ Admin Application

Located inside `admin/`

The admin application provides a dedicated management console for:

- Fleet management
- Vehicle CRUD operations
- Booking management
- Booking approval
- Booking cancellation
- Revenue monitoring
- Active ride monitoring
- Payment configuration
- Inventory management

### 🚀 Backend

Located inside `backend/`

The backend provides:

- REST APIs
- Authentication
- JWT authorization
- Role-Based Access Control
- Booking validation
- Dynamic pricing
- MongoDB integration
- Socket.io communication
- File uploads
- Admin APIs

---

## ✨ Features

### 👤 For Renters

**🏎️ Premium Fleet Browsing**
- Browse superbikes and supercars
- Search and filter vehicles
- View vehicle categories

**⚡ Real-Time Availability**
- Server-side availability validation
- Atomic booking checks
- Socket.io booking locks

**💰 Dynamic Pricing**
- Weekday pricing
- Weekend surge pricing
- Multi-day rental discounts
- Server-side price calculation

**🏍️ Vehicle Details**
- Vehicle images
- Specifications
- Rental price
- Availability
- Booking dates

**💳 UPI Checkout**
- UPI QR-based payment
- Configurable payment information
- Checkout instructions

**📊 User Dashboard**
- Active bookings
- Pending bookings
- Completed rentals
- Booking history

### ⚙️ For Fleet Administrators

**📈 Live Dashboard**
- Revenue overview
- Fleet statistics
- Active rides
- Pending bookings

**🚘 Fleet Management**
- Add vehicles
- Edit vehicles
- Delete vehicles
- Upload vehicle images
- Update pricing
- Manage availability

**📋 Booking Management**
- View bookings
- Approve bookings
- Confirm bookings
- Activate rentals
- Cancel bookings

**💳 Payment Settings**
- Update UPI ID
- Update payment instructions
- Update QR code

**🛡️ Secure Admin Access**
- JWT authentication
- Role-Based Access Control
- Protected admin routes

---

## 🔄 How It Works

### 1. Booking Concurrency

When a customer selects a vehicle and rental dates, the backend checks the requested date range against existing bookings. The system performs an atomic availability check before creating the booking. Socket.io locks are also used during the booking process to prevent multiple users from attempting to reserve the same vehicle simultaneously.

```
Customer A
     │
     │ Book Vehicle
     ▼
Backend
     │
     ├── Check Existing Bookings
     │
     ├── Check Vehicle Lock
     │
     └── Create Booking
             │
             ▼
        MongoDB Atlas
```

If another customer attempts to reserve the same vehicle for overlapping dates, the backend rejects the conflicting request.

### 💰 Dynamic Pricing

The final rental price is calculated on the server.

```
Base Rental Price
        │
        ▼
Weekday / Weekend Adjustment
        │
        ▼
Multi-Day Discount
        │
        ▼
Final Rental Price
```

The client cannot simply submit its own final price because the backend recalculates the amount before creating the booking.

### 🛡️ Role-Based Access Control

Admin routes are protected using JWT authentication and role verification.

```
User Login
    │
    ▼
JWT Token
    │
    ▼
Authentication Middleware
    │
    ▼
Role Check
    │
    ├── Customer → Customer Routes
    │
    └── Admin → Admin Routes
```

Customers cannot access protected fleet management or administrative booking operations.

### 💳 Payment Configuration

UPI payment information is stored in MongoDB rather than being hardcoded. Administrators can update:

- UPI ID
- Payment instructions
- QR code

...without changing the source code or redeploying the application.

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- Context API
- Axios
- Lucide React
- Vanilla CSS
- Vite

**Backend**
- Node.js
- Express.js
- Socket.io
- Multer

**Database**
- MongoDB Atlas
- Mongoose ODM

**Authentication & Security**
- JSON Web Tokens
- bcrypt
- Role-Based Access Control

**Development Tools**
- Git
- GitHub
- VS Code
- MongoDB Compass

---

## 📦 Installation

### Prerequisites

Make sure you have installed:

- Node.js v16+
- npm
- Git
- MongoDB Atlas account

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

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm start
```

The customer application will run on its configured frontend port.

### 4. Admin Dashboard Setup

Open another terminal:

```bash
cd admin
npm install
npm run dev
```

The admin dashboard will run on its Vite development port.

### 5. Optional Database Seeding

To populate the database with sample vehicles:

```bash
cd backend
node seedVehicles.js
```

---

## ▶️ Usage

### Customer Flow

```
Landing Page
     │
     ▼
Fleet Page
     │
     ▼
Vehicle Details
     │
     ▼
Select Rental Dates
     │
     ▼
Dynamic Price Calculation
     │
     ▼
Booking
     │
     ▼
UPI Checkout
     │
     ▼
Booking Confirmation
```

### Admin Flow

```
Admin Login
     │
     ▼
Admin Dashboard
     │
     ├── Fleet Management
     │
     ├── Booking Management
     │
     ├── Revenue
     │
     ├── Active Rides
     │
     └── Payment Settings
```

---

## 📁 Project Structure

```
wheelsonroad/
│
├── admin/
│   ├── public/
│   ├── src/
│   ├── .eslintrc.cjs
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── uploads/
│   │   ├── vehicles/
│   │   └── qr/
│   ├── seedVehicles.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── build/
│   └── package.json
│
├── docs/
│   └── screenshots/
│       ├── business-page.png
│       ├── user-fleet-page.png
│       ├── vehicle-details-page.png
│       ├── admin-fleet-management.png
│       ├── admin-dashboard.png
│       ├── upi-checkout.png
│       └── mongodb-database.png
│
├── .gitignore
└── README.md
```

---

## 📸 Application Showcase & Results

WheelsOnRoad provides a complete end-to-end rental experience across the customer platform, vehicle discovery and booking flow, administrative fleet management, and MongoDB-backed data layer.

### 🏢 1. Business / Landing Page

The business landing page introduces the WheelsOnRoad premium rental platform through a modern dark-themed interface.

It provides:

- Brand introduction
- Premium vehicle showcase
- Rental categories
- Featured vehicles
- Navigation to the fleet
- Clear booking call-to-action

![Business landing page screenshot](./docs/screenshots/business-page.png)

### 👤 2. User Fleet Page

The user fleet page allows customers to explore the complete collection of premium superbikes and supercars.

Users can:

- Browse vehicles
- Search vehicles
- Filter by category
- View rental prices
- Check availability
- Open vehicle details

![User fleet page screenshot](./docs/screenshots/user-fleet-page.png)

### 🏍️ 3. Vehicle Details Page

The vehicle details page provides complete information about an individual rental vehicle.

It includes:

- Vehicle images
- Vehicle name
- Category
- Specifications
- Rental price
- Availability
- Rental date selection
- Dynamic price breakdown
- Booking action

![Vehicle details page screenshot](./docs/screenshots/vehicle-details-page.png)

### 💳 4. UPI Checkout

The checkout page provides customers with a UPI QR-based payment experience.

Customers can view:

- Vehicle information
- Rental dates
- Number of rental days
- Base price
- Discounts
- Weekend adjustments
- Final rental amount
- UPI payment instructions
- QR code

![UPI checkout screenshot](./docs/screenshots/upi-checkout.png)

### ⚙️ 5. Fleet Management Console

The Fleet Management Console provides administrators with centralized control over the rental inventory.

Administrators can:

- ➕ Add new vehicles
- ✏️ Edit vehicle information
- 🖼️ Upload vehicle images
- 💰 Update rental prices
- 🏷️ Change vehicle categories
- 🔄 Manage availability
- 🗑️ Remove vehicles
- 📋 View fleet inventory

![Fleet management console screenshot](./docs/screenshots/admin-fleet-management.png)

### 📊 6. Admin Dashboard

The Admin Dashboard provides administrators with a centralized overview of the rental platform.

It displays information such as:

- Total vehicles
- Total bookings
- Pending bookings
- Active rides
- Revenue information
- Fleet statistics
- Booking activity

![Admin dashboard screenshot](./docs/screenshots/admin-dashboard.png)

### 🍃 7. MongoDB Database

MongoDB Atlas acts as the primary database for the application.

The database stores information including:

- 👤 Users
- 🚘 Vehicles
- 📋 Bookings
- 🔐 Authentication data
- 💳 Payment configuration
- ⚙️ Administrative settings

![MongoDB Atlas database screenshot](./docs/screenshots/mongodb-database.png)

---

## 🔄 Complete Platform Architecture

```
                         🏍️ WHEELSONROAD
                              │
             ┌────────────────┴────────────────┐
             │                                 │
             ▼                                 ▼
      👤 CUSTOMER APP                    ⚙️ ADMIN APP
             │                                 │
             │                                 │
       Business Page                    Admin Dashboard
             │                                 │
       Fleet Browsing                  Fleet Management
             │                                 │
      Vehicle Details                  Booking Management
             │                                 │
       Date Selection                  Payment Settings
             │                                 │
       Price Calculation                Revenue / Rides
             │                                 │
        UPI Checkout                          │
             │                                 │
             └────────────────┬────────────────┘
                              │
                              ▼
                    🚀 NODE + EXPRESS
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
           JWT            Socket.io       Pricing Engine
         / RBAC           Real-Time        Server-Side
             │            Locking           Pricing
             │                │                │
             └────────────────┼────────────────┘
                              │
                              ▼
                       🍃 MONGODB ATLAS
                              │
               ┌──────────────┼──────────────┐
               │              │              │
               ▼              ▼              ▼
             Users         Vehicles       Bookings
                              │
                              ▼
                       Payment Settings
```

---

## 📷 Screenshot Gallery

### Business & Customer Experience

| 🏢 Business Page | 👤 User Fleet |
|---|---|
| ![Business page](./docs/screenshots/business-page.png) | ![User fleet page](./docs/screenshots/user-fleet-page.png) |

### Vehicle & Booking

| 🏍️ Vehicle Details | 💳 UPI Checkout |
|---|---|
| ![Vehicle details page](./docs/screenshots/vehicle-details-page.png) | ![UPI checkout](./docs/screenshots/upi-checkout.png) |

### Administration

| ⚙️ Fleet Management | 📊 Admin Dashboard |
|---|---|
| ![Fleet management console](./docs/screenshots/admin-fleet-management.png) | ![Admin dashboard](./docs/screenshots/admin-dashboard.png) |

### Database

<div align="center">

**🍃 MongoDB Atlas**

![MongoDB Atlas database](./docs/screenshots/mongodb-database.png)

</div>

> Add your own screenshots into `docs/screenshots/` with the filenames shown above so they render correctly on GitHub.

---

## 🏆 Results

The WheelsOnRoad platform successfully demonstrates a complete rental management workflow.

### Customer Results

- ✅ Premium rental landing page
- ✅ Fleet browsing
- ✅ Vehicle search and filtering
- ✅ Vehicle details
- ✅ Real-time availability
- ✅ Dynamic pricing
- ✅ Booking workflow
- ✅ UPI QR checkout
- ✅ Customer dashboard

### Admin Results

- ✅ Admin authentication
- ✅ Fleet management
- ✅ Vehicle CRUD operations
- ✅ Vehicle image uploads
- ✅ Booking management
- ✅ Booking approval
- ✅ Active ride monitoring
- ✅ Revenue monitoring
- ✅ Payment configuration

### Backend Results

- ✅ REST API architecture
- ✅ MongoDB Atlas integration
- ✅ JWT authentication
- ✅ RBAC authorization
- ✅ Password hashing
- ✅ Server-side pricing
- ✅ Booking collision detection
- ✅ Socket.io real-time communication
- ✅ File upload handling

### Reliability Results

The platform was tested against concurrent booking scenarios where multiple requests attempt to reserve the same vehicle for overlapping dates. The backend availability checks prevent conflicting bookings from being created. Dynamic pricing is also calculated server-side at booking time rather than trusting the price supplied by the client.

---

## 🔐 Security Notes

- `MONGO_URI` must never be committed to GitHub.
- `JWT_SECRET` must never be committed to GitHub.
- `.env` files should be included in `.gitignore`.
- Passwords are hashed using bcrypt.
- Admin routes are protected by JWT authentication.
- Admin routes additionally verify the user's role.
- Pricing is calculated server-side.
- Booking availability is validated by the backend.
- Sensitive credentials should be stored using environment variables.

Example `.gitignore`:

```gitignore
node_modules/
.env
.env.local
dist/
build/
.DS_Store
npm-debug.log*
```

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your changes
4. Commit your changes
   ```bash
   git add .
   git commit -m "Add your feature"
   ```
5. Push your branch
   ```bash
   git push origin feature/your-feature
   ```
6. Create a Pull Request

Submit a Pull Request for review.

---

## 🔮 Future Enhancements

Potential future improvements include:

- 💳 Razorpay / Stripe integration
- ⭐ Vehicle reviews and ratings
- 📧 Automated email confirmations
- 📱 SMS booking notifications
- 📍 GPS-based vehicle tracking
- 📅 Advanced availability calendar
- 🤖 AI-powered vehicle recommendations
- 📊 Advanced analytics dashboard
- ☁️ Cloud image storage
- 🔔 Real-time booking notifications

---

## 📄 License

This project is **proprietary** and built specifically for the WheelsOnRoad premium mobility platform.

All rights reserved.

---

<div align="center">

Built with ⚙️ MERN and a lot of attention to concurrency edge cases.

</div>
