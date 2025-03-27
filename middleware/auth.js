const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

module.exports = (req, res, next) => {
  // 1) Check for token in multiple locations
  let token;
  const authHeader = req.headers.authorization;
  
  // Check Authorization header first
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } 
  // Then check cookies
  else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  // 2) Verify token exists
  if (!token) {
    return next(
      new AppError('Authentication required. Please log in to access.', 401)
    );
  }

  // 3) Verify token validity
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      let errorMessage = 'Invalid authentication token';
      
      if (err.name === 'TokenExpiredError') {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid authentication token. Please log in again.';
      }
      
      return next(new AppError(errorMessage, 401));
    }

    // 4) Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user' // Default role if not specified
    };
    
    next();
  });
};

// Role-based access control middleware
module.exports.restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // 1) Check if user role is included in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    
    next();
  };
};

// Optional: Admin verification middleware
module.exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new AppError('This action requires administrator privileges', 403)
    );
  }
  next();
};