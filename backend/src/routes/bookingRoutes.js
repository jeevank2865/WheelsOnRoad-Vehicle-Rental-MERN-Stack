const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.get('/all', protect, authorize('admin'), getAllBookings);
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);

module.exports = router;
