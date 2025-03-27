const { pool } = require('../config/db');
const AppError = require('../utils/appError');

// @desc    Get all products with optional search and pagination
exports.getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, u.name as seller_name, u.avatar as seller_avatar
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.status = 'active'
    `;
    const params = [];

    if (search) {
      query += ` AND (p.title ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const products = await pool.query(query, params);

    res.status(200).json({
      status: 'success',
      results: products.rows.length,
      data: { products: products.rows }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single product by ID
exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await pool.query(
      `SELECT p.*, u.name as seller_name, u.avatar as seller_avatar
       FROM products p
       JOIN users u ON p.seller_id = u.id
       WHERE p.id = $1 AND p.status = 'active'`,
      [id]
    );

    if (!product.rows.length) {
      return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { product: product.rows[0] }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new product
exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, images } = req.body;
    const sellerId = req.user.id;

    const newProduct = await pool.query(
      `INSERT INTO products 
       (title, description, price, images, seller_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, price, images, sellerId]
    );

    res.status(201).json({
      status: 'success',
      data: { product: newProduct.rows[0] }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update an existing product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, images } = req.body;

    // Verify product belongs to user
    const product = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND seller_id = $2',
      [id, req.user.id]
    );

    if (!product.rows.length) {
      return next(new AppError('No product found with that ID or not authorized', 404));
    }

    const updatedProduct = await pool.query(
      `UPDATE products SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       price = COALESCE($3, price),
       images = COALESCE($4, images),
       updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [title, description, price, images, id]
    );

    res.status(200).json({
      status: 'success',
      data: { product: updatedProduct.rows[0] }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a product (soft delete by setting status to 'deleted')
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify product belongs to user
    const product = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND seller_id = $2',
      [id, req.user.id]
    );

    if (!product.rows.length) {
      return next(new AppError('No product found with that ID or not authorized', 404));
    }

    await pool.query(
      'UPDATE products SET status = $1 WHERE id = $2',
      ['deleted', id]
    );

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's products
exports.getUserProducts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const userProducts = await pool.query(
      `SELECT p.*, u.name as seller_name, u.avatar as seller_avatar
       FROM products p
       JOIN users u ON p.seller_id = u.id
       WHERE p.seller_id = $1 AND p.status = 'active'
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      status: 'success',
      results: userProducts.rows.length,
      data: { products: userProducts.rows }
    });
  } catch (err) {
    next(err);
  }
};