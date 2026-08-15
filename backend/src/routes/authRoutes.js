const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/signup', registerUser); // legacy route compatibility
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
