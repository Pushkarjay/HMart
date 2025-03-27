const winston = require('winston');
const { combine, timestamp, printf, colorize, align } = winston.format;
const path = require('path');

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Base logger configuration
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log'),
      level: 'info'
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/errors.log'),
      level: 'error'
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/exceptions.log') 
    })
  ]
});

// Morgan stream for HTTP logging
logger.morganStream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Pretty print for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason.stack || reason}`);
});

module.exports = logger;