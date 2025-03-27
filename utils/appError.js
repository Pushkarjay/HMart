// utils/appError.js

class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true; // Set to true to indicate it's an expected error
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  