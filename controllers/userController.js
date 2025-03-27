const { pool } = require('../config/db');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

exports.getMe = async (req, res, next) => {
  try {
    const user = await pool.query(
      'SELECT id, email, name, avatar, hostel, room FROM users WHERE id = $1',
      [req.user.id]
    );

    res.status(200).json({
      status: 'success',
      data: { user: user.rows[0] }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { name, avatar, hostel, room } = req.body;

    const updatedUser = await pool.query(
      `UPDATE users SET
       name = COALESCE($1, name),
       avatar = COALESCE($2, avatar),
       hostel = COALESCE($3, hostel),
       room = COALESCE($4, room),
       updated_at = NOW()
       WHERE id = $5
       RETURNING id, email, name, avatar, hostel, room`,
      [name, avatar, hostel, room, req.user.id]
    );

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser.rows[0] }
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1) Get user from database
    const user = await pool.query(
      'SELECT id, password FROM users WHERE id = $1',
      [req.user.id]
    );

    // 2) Check if current password is correct
    if (!(await bcrypt.compare(currentPassword, user.rows[0].password))) {
      return next(new AppError('Your current password is wrong', 401));
    }

    // 3) Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 4) Update password
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserProducts = async (req, res, next) => {
  try {
    const products = await pool.query(
      `SELECT * FROM products 
       WHERE seller_id = $1 AND status = 'active'
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.status(200).json({
      status: 'success',
      results: products.rows.length,
      data: { products: products.rows }
    });
  } catch (err) {
    next(err);
  }
};