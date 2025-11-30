const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { morganMiddleware } = require('./middlewares/morganMiddleware');
const helmet = require('helmet'); // Import helmet
require('dotenv').config();

const app = express();

// Core Middlewares - Apply these first
app.use(helmet()); // Set various security HTTP headers

// CORS configuration - place after helmet if helmet sets related headers, or configure helmet's CORS options
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing, cookie parsing
app.use(express.json({ limit: '10kb' })); // Limit request body size
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morganMiddleware); // HTTP request logger

// Swagger UI for API Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.config');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));


// Basic route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Backend API is healthy' });
});

// API routes
const authRoutes = require('./routes/auth.routes');
const boardRoutes = require('./routes/board.routes');
const userRoutes = require('./routes/user.routes'); // For user settings

// Note: taskRoutes are mounted within boardRoutes, so no direct app.use(taskRoutes) here.

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/boards', boardRoutes); // This includes /api/v1/boards/:boardId/tasks and permission routes
app.use('/api/v1/user', userRoutes);    // For /api/v1/user/settings


// Global error handler middleware (should be last)
// It should use the AppError structure if the error is operational
const { AppError } = require('./utils/errors');
const logger = require('./utils/logger');

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Log unexpected errors
  logger.error('UNEXPECTED ERROR: ', err);
  // console.error('UNEXPECTED ERROR 💥', err);


  // Send generic message for non-operational errors
  return res.status(500).json({
    status: 'error',
    statusCode,
    message
  });
});

module.exports = app;
