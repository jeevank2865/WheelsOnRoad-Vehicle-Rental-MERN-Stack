const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'craftisan_secret');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User account not found' });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  } else if (req.headers['auth-token']) {
    // Legacy support fallback
    try {
      token = req.headers['auth-token'];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'craftisan_secret');
      req.user = await User.findById(decoded.id || decoded.user?.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
