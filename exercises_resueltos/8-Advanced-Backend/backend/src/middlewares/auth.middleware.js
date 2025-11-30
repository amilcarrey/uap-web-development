const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');
const { verifyToken } = require('../utils/jwt.utils');
const asyncHandler = require('express-async-handler'); // Using a package for cleaner async middleware

/**
 * Middleware to protect routes.
 * Verifies JWT token from cookie and attaches user to request object.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1) Get token from cookie
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // Optional: Get token from Authorization header (Bearer token)
  // else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  //   token = req.headers.authorization.split(' ')[1];
  // }

  if (!token || token === 'loggedout') {
    return next(new UnauthorizedError('You are not logged in. Please log in to get access.'));
  }

  // 2) Verify token
  const decodedPayload = verifyToken(token);
  if (!decodedPayload) {
    // This can happen if the token is invalid or expired
    // Clear cookie if invalid/expired?
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    });
    return next(new UnauthorizedError('Invalid or expired token. Please log in again.'));
  }

  // 3) Check if user still exists
  const currentUser = await User.findByPk(decodedPayload.id, {
    // Exclude passwordHash from the user object attached to req
    attributes: { exclude: ['passwordHash'] }
  });

  if (!currentUser) {
    return next(new UnauthorizedError('The user belonging to this token no longer exists.'));
  }

  // 4) Check if user changed password after the token was issued (optional but good security)
  // This requires a `passwordChangedAt` field in the User model
  // if (currentUser.changedPasswordAfter(decodedPayload.iat)) {
  //   return next(new UnauthorizedError('User recently changed password. Please log in again.'));
  // }

  // Grant access to protected route
  req.user = currentUser; // Attach user to request object
  next();
});

/**
 * Middleware to authorize roles.
 * Example: authorize('admin', 'lead-guide')
 * @param  {...string} roles - Allowed roles.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Roles is an array e.g. ['admin', 'editor']. req.user.role should be set.
    // This project uses permission levels on boards, not general user roles.
    // This function is a placeholder for role-based authorization if needed later.
    // For board-specific permissions, a different middleware will be created.
    if (!req.user || !roles.includes(req.user.role)) { // Assuming req.user.role exists
      return next(new ForbiddenError('You do not have permission to perform this action.'));
    }
    next();
  };
};

module.exports = {
  protect,
  authorize, // Placeholder, specific permission middleware will be more relevant
};
