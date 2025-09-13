const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; // Default to 1 day
const COOKIE_EXPIRES_IN_DAYS = parseInt(process.env.COOKIE_EXPIRES_IN_DAYS || '1', 10); // In days for cookie

if (!JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
}

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // Or throw an error, depending on desired handling
  }
};

const sendTokenResponse = (res, user, statusCode) => {
  const token = generateToken({ id: user.id, username: user.username }); // Add more payload if needed

  const cookieOptions = {
    expires: new Date(Date.now() + COOKIE_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'lax', // Or 'strict' or 'none' (if 'none', secure must be true)
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove passwordHash from output
  const userOutput = { ...user.toJSON() };
  delete userOutput.passwordHash;


  res.status(statusCode).json({
    status: 'success',
    token, // Optionally send token in body too, though cookie is primary
    data: {
      user: userOutput,
    },
  });
};

module.exports = {
  generateToken,
  verifyToken,
  sendTokenResponse,
  JWT_EXPIRES_IN,
  COOKIE_EXPIRES_IN_DAYS
};
