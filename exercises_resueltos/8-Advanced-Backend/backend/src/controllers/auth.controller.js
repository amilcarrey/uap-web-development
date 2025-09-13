const authService = require('../services/auth.service');
const { sendTokenResponse } = require('../utils/jwt.utils');
const { UserSetting } = require('../models'); // For creating default settings

// Simple try/catch wrapper for async route handlers
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ status: 'fail', message: 'Please provide username, email, and password' });
  }

  const user = await authService.registerUser({ username, email, password });

  // Create default user settings upon registration
  await UserSetting.findOrCreate({
    where: { userId: user.id },
    defaults: { userId: user.id } // Default values for interval/prefs are in model
  });

  // user object from service does not have passwordHash removed yet.
  // sendTokenResponse will handle JWT and stripping passwordHash.
  sendTokenResponse(res, user, 201);
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
  }

  const user = await authService.loginUser({ email, password });
  sendTokenResponse(res, user, 200);
});

const logout = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});

// Example of a protected route controller function
const getMe = asyncHandler(async (req, res, next) => {
  // req.user is attached by the authMiddleware
  // Make sure to select only necessary fields or remove sensitive ones
  const user = {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    // include other non-sensitive fields if needed
  };

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});


module.exports = {
  register,
  login,
  logout,
  getMe, // For testing authentication
  asyncHandler, // Export for use in other controllers
};
