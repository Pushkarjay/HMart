const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');
const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const register = async (userData) => {
  // Check if email exists
  const existingUser = await prisma.user.findUnique({ 
    where: { email: userData.email } 
  });
  
  if (existingUser) {
    logger.warn(`Registration attempt with existing email: ${userData.email}`);
    throw new ApiError(400, 'Email already taken');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  // Create user
  try {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    logger.info(`New user registered: ${user.email}`);
    return user;
  } catch (error) {
    logger.error('Registration failed', error);
    throw new ApiError(500, 'Registration failed. Please try again.');
  }
};

const login = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        avatar: true
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn(`Failed login attempt for email: ${email}`);
      throw new ApiError(401, 'Incorrect email or password');
    }

    // Generate token with additional user claims
    const token = jwt.generateToken({
      userId: user.id,
      role: user.role
    });

    logger.info(`User logged in: ${email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      },
      token
    };
  } catch (error) {
    logger.error('Login error', error);
    throw error;
  }
};

const logout = async (token) => {
  // In a real app, you might add token to a blacklist
  logger.info(`User logged out. Token: ${token.substring(0, 10)}...`);
  return true;
};

const checkAuthStatus = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        hostel: true,
        room: true
      }
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  } catch (error) {
    logger.error('Auth status check failed', error);
    throw error;
  }
};

module.exports = {
  register,
  login,
  logout,
  checkAuthStatus
};