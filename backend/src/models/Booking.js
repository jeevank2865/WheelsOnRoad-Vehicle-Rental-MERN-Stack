const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED'], default: 'PAYMENT_PENDING' },
  status: { type: String, enum: ['Pending Approval', 'Confirmed', 'Active (Rented)', 'Completed', 'Cancelled'], default: 'Pending Approval' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  paymentExpiry: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
