const express = require('express');
const router = express.Router();
const { getVehicles, getVehicleById, checkAvailability, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', getVehicles);
router.post('/', protect, authorize('admin'), createVehicle);
router.get('/:id', getVehicleById);
router.put('/:id', protect, authorize('admin'), updateVehicle);
router.delete('/:id', protect, authorize('admin'), deleteVehicle);
router.post('/:id/check-availability', checkAvailability);

module.exports = router;
