const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validate = require('../middleware/validateRequest');
const { updateUserSchema } = require('../validations/userValidation');
const auth = require('../middleware/auth');

// @route   GET /api/v1/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, userController.getCurrentUser);

// @route   PUT /api/v1/users/me
// @desc    Update current user profile
// @access  Private
router.put(
  '/me',
  auth,
  validate(updateUserSchema),
  userController.updateCurrentUser
);

// @route   DELETE /api/v1/users/me
// @desc    Delete current user account
// @access  Private
router.delete('/me', auth, userController.deleteCurrentUser);

// @route   GET /api/v1/users/:id/products
// @desc    Get products by user ID
// @access  Public
router.get('/:id/products', userController.getUserProducts);

// ADMIN ROUTES (protected by admin middleware)
// @route   GET /api/v1/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', auth, userController.getAllUsers);

// @route   GET /api/v1/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private/Admin
router.get('/:id', auth, userController.getUserById);

module.exports = router;