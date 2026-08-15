const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to create a new Razorpay order
router.post('/create-order', paymentController.createOrder);

// Route to verify the payment signature
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
