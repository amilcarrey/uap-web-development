const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { ConflictError, UnauthorizedError, BadRequestError } = require('../utils/errors');
const { Op } = require('sequelize');

/**
 * Registers a new user.
 * @param {object} userData - User data (username, email, password).
 * @returns {Promise<User>} The created user object.
 * @throws {ConflictError} If username or email already exists.
 * @throws {BadRequestError} If password is too short.
 */
async function registerUser({ username, email, password }) {
  if (!password || password.length < 8) {
    throw new BadRequestError('Password must be at least 8 characters long.');
  }

  // Check if username or email already exists
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ username }, { email }],
    },
  });

  if (existingUser) {
    if (existingUser.username === username) {
      throw new ConflictError('Username already exists.');
    }
    if (existingUser.email === email) {
      throw new ConflictError('Email already registered.');
    }
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  try {
    const newUser = await User.create({
      username,
      email,
      passwordHash,
    });
    // TODO: After user creation, create default UserSettings? Or handle lazily.
    // For now, UserSettings will be created when first accessed/updated.
    return newUser;
  } catch (error) {
    // Catch Sequelize validation errors if any (e.g., unique constraints if not caught above)
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      throw new ConflictError(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`);
    }
    throw error; // Re-throw other errors
  }
}

/**
 * Logs in a user.
 * @param {object} credentials - User credentials (email, password).
 * @returns {Promise<User>} The authenticated user object.
 * @throws {UnauthorizedError} If login fails (user not found or password incorrect).
 * @throws {BadRequestError} If email or password is not provided.
 */
async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password.');
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials - user not found.');
  }

  const isMatch = await user.isValidPassword(password); // Using instance method from User model

  if (!isMatch) {
    throw new UnauthorizedError('Invalid credentials - password incorrect.');
  }

  return user;
}

module.exports = {
  registerUser,
  loginUser,
};
