const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { productSchema, updateProductSchema, validateProduct } = require('../validations/productValidation');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/v1/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/v1/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', productController.getProduct);

// @route   POST /api/v1/products
// @desc    Create a product
// @access  Private
router.post(
  '/',
  auth, // Ensure the user is authenticated
  upload.array('images', 5), // Allow 5 images for upload
  validateProduct(productSchema), // Use the validateProduct middleware with productSchema
  productController.createProduct
);

// @route   PUT /api/v1/products/:id
// @desc    Update a product
// @access  Private (Product owner or admin)
router.put(
  '/:id',
  auth, // Ensure the user is authenticated
  upload.array('images', 5), // Allow 5 images for upload
  validateProduct(updateProductSchema), // Use the validateProduct middleware with updateProductSchema
  productController.updateProduct
);

// @route   DELETE /api/v1/products/:id
// @desc    Delete a product
// @access  Private (Product owner or admin)
router.delete('/:id', auth, productController.deleteProduct);

// @route   GET /api/v1/products/user/me
// @desc    Get current user's products
// @access  Private
router.get('/user/me', auth, productController.getUserProducts);

module.exports = router;