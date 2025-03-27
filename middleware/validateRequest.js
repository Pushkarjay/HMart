const { celebrate, Joi, Segments } = require('celebrate');
const AppError = require('../utils/appError');

// Reusable validators
const objectIdValidator = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const passwordValidator = Joi.string().min(8).required();
const emailValidator = Joi.string().email().required();

// Common validation schemas
const authValidation = {
  [Segments.BODY]: Joi.object({
    email: emailValidator,
    password: passwordValidator
  })
};

const userValidation = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30),
    email: emailValidator,
    password: passwordValidator,
    avatar: Joi.string().uri(),
    hostel: Joi.string().max(50),
    room: Joi.string().max(10)
  })
};

const productValidation = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500),
    price: Joi.number().min(0).required(),
    images: Joi.array().items(Joi.string().uri()),
    status: Joi.string().valid('active', 'sold', 'pending')
  })
};

// Middleware factory
const validate = (schema, options = {}) => {
  return celebrate(schema, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
    ...options
  });
};

// Custom validation middleware
const validateObjectId = (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid ID format', 400));
  }
  next();
};

// File upload validation
const validateFileUpload = (fieldName, allowedTypes, maxSizeMB) => {
  return (req, res, next) => {
    if (!req.file) {
      return next(new AppError(`Please upload a ${fieldName}`, 400));
    }

    const file = req.file;
    const fileType = file.mimetype.split('/')[0];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(fileType)) {
      return next(
        new AppError(
          `Invalid file type. Only ${allowedTypes.join(', ')} are allowed`,
          400
        )
      );
    }

    if (file.size > maxSizeBytes) {
      return next(
        new AppError(
          `File too large. Maximum size is ${maxSizeMB}MB`,
          400
        )
      );
    }

    next();
  };
};

module.exports = {
  validate,
  validateObjectId,
  validateFileUpload,
  schemas: {
    auth: authValidation,
    user: userValidation,
    product: productValidation
  }
};