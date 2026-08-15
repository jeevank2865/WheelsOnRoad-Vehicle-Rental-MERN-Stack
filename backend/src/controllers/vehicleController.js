const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// @desc    Get all vehicles (filter by category, vehicleType, search)
// @route   GET /api/vehicles
const getVehicles = async (req, res) => {
  const { vehicleType, category, search } = req.query;
  let query = {};

  if (vehicleType && vehicleType !== 'All') {
    query.vehicleType = vehicleType;
  }
  if (category && category !== 'All') {
    query.category = category;
  }
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  try {
    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check availability collision for date range
// @route   POST /api/vehicles/:id/check-availability
const checkAvailability = async (req, res) => {
  const { startDate, endDate } = req.body;
  const vehicleId = req.params.id;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const overlappingBookings = await Booking.find({
    vehicle: vehicleId,
    status: { $ne: 'Cancelled' },
    $and: [
      { startDate: { $lte: end } },
      { endDate: { $gte: start } }
    ]
  });

  if (overlappingBookings.length > 0) {
    res.json({ available: false, message: 'Vehicle is already reserved for the selected date range.' });
  } else {
    res.json({ available: true, message: 'Vehicle is available for instant lock & booking!' });
  }
};

// @desc    Create new vehicle (Admin)
// @route   POST /api/vehicles
const createVehicle = async (req, res) => {
  try {
    const {
      title,
      brand,
      model,
      year,
      description,
      vehicleType,
      category,
      engineCC,
      powerHP,
      dailyRate,
      weekendSurgeRate,
      securityDeposit,
      transmission,
      images,
      locationBranch
    } = req.body;

    if (!title || !brand || !vehicleType || !category || !dailyRate) {
      return res.status(400).json({ message: 'Please provide all required vehicle fields.' });
    }

    const vehicle = new Vehicle({
      title,
      brand,
      model: model || title,
      year: year || new Date().getFullYear(),
      description: description || '',
      vehicleType,
      category,
      engineCC: Number(engineCC) || 150,
      powerHP: Number(powerHP) || 15,
      dailyRate: Number(dailyRate),
      weekendSurgeRate: Number(weekendSurgeRate) || Number(dailyRate) * 1.2,
      securityDeposit: Number(securityDeposit) || 300,
      transmission: transmission || 'Manual',
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop'],
      locationBranch: locationBranch || 'Central Hub'
    });

    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update existing vehicle (Admin)
// @route   PUT /api/vehicles/:id
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete vehicle (Admin)
// @route   DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getVehicles, getVehicleById, checkAvailability, createVehicle, updateVehicle, deleteVehicle };
