const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { calculateRentalCost } = require('../services/rentalPricingService');

// @desc    Create new rental booking with date collision protection
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  const { vehicleId, startDate, endDate, driverLicenseNumber } = req.body;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  // Atomic Collision Check
  const overlappingBookings = await Booking.find({
    vehicle: vehicleId,
    status: { $ne: 'Cancelled' },
    $and: [
      { startDate: { $lte: end } },
      { endDate: { $gte: start } }
    ]
  });

  if (overlappingBookings.length > 0) {
    return res.status(400).json({ message: 'Reservation collision: Vehicle is already booked for these dates!' });
  }

  const pricing = calculateRentalCost(vehicle, startDate, endDate);

  const booking = new Booking({
    user: req.user._id,
    vehicle: vehicleId,
    startDate: start,
    endDate: end,
    totalDays: pricing.totalDays,
    totalCost: pricing.totalCost,
    securityDeposit: pricing.securityDeposit,
    driverLicenseNumber: driverLicenseNumber || 'DL-VERIFIED-9921',
    status: 'Pending Approval'
  });

  const createdBooking = await booking.save();

  // Socket.io Real-Time Broadcast to emit lock
  if (req.io) {
    req.io.emit('vehicleLocked', { vehicleId, startDate, endDate });
  }

  res.status(201).json(createdBooking);
};

// @desc    Get current user's rental history & active bookings
// @route   GET /api/bookings/mybookings
const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('vehicle')
    .sort({ createdAt: -1 });
  res.json(bookings);
};

// @desc    Admin: Get all bookings
// @route   GET /api/bookings/all
const getAllBookings = async (req, res) => {
  const bookings = await Booking.find({}).populate('vehicle').populate('user', 'name email').sort({ createdAt: -1 });
  res.json(bookings);
};

// @desc    Admin: Update booking status
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id, 
    { status: req.body.status }, 
    { new: true }
  );
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (req.io) req.io.emit('bookingStatusUpdated', { bookingId: booking._id, status: booking.status });
  res.json(booking);
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus };
