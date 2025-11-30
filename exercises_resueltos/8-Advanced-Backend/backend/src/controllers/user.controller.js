const userService = require('../services/user.service');
const { asyncHandler } = require('./auth.controller'); // Re-using asyncHandler

const getUserSettings = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID from 'protect' middleware
  const settings = await userService.getUserSettings(userId);

  res.status(200).json({
    status: 'success',
    data: { settings },
  });
});

const updateUserSettings = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const settingsData = req.body; // Contains { autoUpdateInterval, taskVisualizationPrefs }

  // Basic validation: ensure at least one field is present if body is not empty
  if (Object.keys(settingsData).length === 0 && req.get('Content-Length') > 2) { // >2 for empty {}
     // Allow empty body to signify no change, or require specific fields
     // For now, service handles empty data, so this check might be redundant
  }

  const updatedSettings = await userService.updateUserSettings(userId, settingsData);

  res.status(200).json({
    status: 'success',
    message: 'Settings updated successfully.',
    data: { settings: updatedSettings },
  });
});

module.exports = {
  getUserSettings,
  updateUserSettings,
};
