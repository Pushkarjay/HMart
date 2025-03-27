const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const authController = require('../controllers/authController');

const router = express.Router();

// User signup
router.post('/signup', celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
}), authController.signup);

// User login
router.post('/login', celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
}), authController.login);

router.use(errors()); // Celebrate error handling

module.exports = router;
