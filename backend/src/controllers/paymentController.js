const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

const createOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
    });

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${bookingId}`
    };

    const order = await instance.orders.create(options);

    // Update booking with the new order ID
    await Booking.findByIdAndUpdate(bookingId, { razorpayOrderId: order.id });

    res.json({ success: true, order });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ success: false, message: 'Could not create Razorpay order.' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';

    // Verify signature
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'CONFIRMED',
        status: 'Confirmed',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      });

      // Emit event for real-time unlock
      if (req.io) {
        req.io.emit('vehicleAvailabilityUpdated', { bookingId, status: 'CONFIRMED' });
      }

      res.json({ success: true, message: 'Payment verified successfully.' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature.' });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment.' });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
