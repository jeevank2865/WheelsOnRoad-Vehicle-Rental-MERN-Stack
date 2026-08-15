const mongoose = require('mongoose');

const paymentSettingsSchema = new mongoose.Schema({
  // Only one document exists at a time (singleton pattern)
  singleton: { type: String, default: 'main', unique: true },

  // UPI Config
  upiId: { type: String, trim: true, default: '' },
  upiName: { type: String, trim: true, default: '' },  // Merchant display name
  upiDescription: { type: String, trim: true, default: 'ApexLease Vehicle Rental' },

  // QR Code Image (uploaded via /upload endpoint)
  qrCodeImageUrl: { type: String, default: '' },

  // Payment instructions shown to customer
  paymentInstructions: { type: String, default: 'Scan the QR code or use the UPI ID to pay. Send a screenshot of the payment confirmation to complete your booking.' },

  // Confirmation window (how long the booking stays PAYMENT_PENDING after user claims to have paid)
  confirmationWindowMinutes: { type: Number, default: 60 },

  // Whether to accept UPI payments at all
  upiEnabled: { type: Boolean, default: true },

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PaymentSettings', paymentSettingsSchema);
