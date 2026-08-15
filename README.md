# WheelsOnRoad (ApexLease) 🏍️🚗

WheelsOnRoad (also known as ApexLease) is a premium, full-stack MERN application designed for renting high-performance Superbikes and Supercars. It offers a sleek, dark-themed user interface, robust administrative controls, and a seamless booking experience complete with UPI payment integration.

## 🌟 Key Features

### For Renters (Customers)
*   **Premium Fleet Browsing:** Filter and search through an extensive catalog of superbikes and supercars.
*   **Real-Time Availability:** Prevent double-booking with real-time atomic collision checks and Socket.io locks.
*   **Dynamic Pricing:** Automatic calculation of weekday, weekend surge rates, and multi-day discounts.
*   **Seamless Booking Flow:** Select dates, view a detailed price breakdown, and finalize bookings via secure UPI QR payments.
*   **My Dashboard:** Track the status of active, pending, and past rides all in one place.

### For Fleet Administrators
*   **Live Dashboard:** Overview of total revenue, active rides, and pending approvals.
*   **Inventory Management:** Full CRUD operations (Add, Edit, Delete) for fleet vehicles directly from the UI.
*   **Booking Management:** Review booking requests, update statuses (e.g., Pending Approval -> Confirmed -> Active), and manage cancellations.
*   **Dynamic Payment Settings:** Update the company's UPI ID, instructions, and QR code for customer checkouts dynamically without touching code.
*   **Secure Access:** All administrative actions are protected by strict JWT Role-Based Access Control (RBAC).

## 🛠️ Technology Stack

*   **Frontend:** React.js, Context API for state management, Axios for API calls, Lucide-React for premium iconography, Vanilla CSS (Dark/Orange theme).
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB Atlas (Mongoose ODM).
*   **Authentication:** JSON Web Tokens (JWT) & bcrypt for secure password hashing.
*   **Real-time:** Socket.io (for handling concurrent booking locks).
*   **File Uploads:** Multer for handling vehicle images and QR code uploads.

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16+)
*   MongoDB Atlas cluster (Ensure your IP is whitelisted!)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (`backend/.env`):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

### 3. Database Seeding (Optional)
To quickly populate your fleet with premium vehicles, a seeder script is provided.
```bash
cd backend
node seedVehicles.js
```
*This will insert 100 superbikes and 100 supercars into your database.*

## 🔒 Security Notes
*   Ensure that the MongoDB connection string (`MONGO_URI`) and JWT secret (`JWT_SECRET`) are never committed to version control.
*   The application includes middleware to prevent non-admins from modifying fleet inventory or viewing all reservations.

## 📄 License
This project is proprietary and built specifically for the WheelsOnRoad premium mobility platform.
