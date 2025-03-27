const AppError = require('../utils/appError');
const { isCelebrateError } = require('celebrate');
const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');

const handleJWTError = () => 
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => 
  new AppError('Your token has expired! Please log in again.', 401);

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  return new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.detail.match(/"([^"]*)"/)[1];
  return new AppError(`Duplicate field value: ${value}. Please use another value!`, 400);
};

const handleCelebrateError = (err) => {
  const errorDetails = [];
  err.details.forEach((validationError) => {
    validationError.details.forEach((detail) => {
      errorDetails.push(detail.message);
    });
  });
  return new AppError(`Validation error: ${errorDetails.join('. ')}`, 400);
};

const sendErrorDev = (err, req, res) => {
  // API error response
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Rendered error page for non-API routes
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // API error response
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // Rendered error page for non-API routes
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.code === '23505') error = handleDuplicateFieldsDB(error);
    if (isCelebrateError(error)) error = handleCelebrateError(error);
    if (error instanceof JsonWebTokenError) error = handleJWTError();
    if (error instanceof TokenExpiredError) error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};