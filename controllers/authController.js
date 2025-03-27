const { pool } = require('../config/db');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

exports.signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // 1) Check if user exists
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userExists.rows.length > 0) {
      return next(new AppError('Email already in use', 400));
    }

    // 2) Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3) Create user
    const newUser = await pool.query(
      `INSERT INTO users (email, password, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, avatar, created_at`,
      [email.toLowerCase(), hashedPassword, name]
    );

    // 4) Generate tokens
    const user = newUser.rows[0];
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // 5) Send response
    res.status(201).json({
      status: 'success',
      token,
      refreshToken,
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if user exists and password is correct
    const user = await pool.query(
      'SELECT id, email, password, name, avatar FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (!user.rows.length || !(await bcrypt.compare(password, user.rows[0].password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 2) Generate tokens
    const token = generateToken(user.rows[0].id);
    const refreshToken = generateRefreshToken(user.rows[0].id);

    // 3) Remove password from output
    const userData = { ...user.rows[0] };
    delete userData.password;

    // 4) Send response
    res.status(200).json({
      status: 'success',
      token,
      refreshToken,
      data: { user: userData }
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return next(new AppError('Refresh token is required', 400));
    }

    // Verify refresh token (implementation depends on your jwt utils)
    const decoded = await verifyRefreshToken(refreshToken);
    
    // Generate new access token
    const newToken = generateToken(decoded.id);
    
    res.status(200).json({
      status: 'success',
      token: newToken
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // This is handled by passport middleware
    next();
  } catch (err) {
    next(err);
  }
};