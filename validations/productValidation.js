const Joi = require('joi');

// Product schema for creation
const productSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Product name is required',
    'any.required': 'Product name is required'
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be positive',
    'any.required': 'Price is required'
  }),
  description: Joi.string().allow('').optional(),
  category: Joi.string().required().messages({
    'string.empty': 'Category is required',
    'any.required': 'Category is required'
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'Stock must be a number',
    'number.integer': 'Stock must be an integer',
    'number.min': 'Stock cannot be negative',
    'any.required': 'Stock is required'
  })
});

// Product schema for updates (all fields optional)
const updateProductSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number().positive(),
  description: Joi.string().allow(''),
  category: Joi.string(),
  stock: Joi.number().integer().min(0)
});

// Validation middleware factory
const validateProduct = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.context.key,
        message: detail.message
      }));
      return res.status(400).json({ errors });
    }
    
    next();
  };
};

module.exports = {
  productSchema,
  updateProductSchema,
  validateProduct
};