const express = require('express');
const router = express.Router();
const { getPaymentSettings, updatePaymentSettings } = require('../controllers/paymentSettingsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public: customers need QR code to pay
router.get('/', getPaymentSettings);

// Admin only: update UPI ID, QR code, instructions
router.put('/', protect, authorize('admin'), updatePaymentSettings);

module.exports = router;
