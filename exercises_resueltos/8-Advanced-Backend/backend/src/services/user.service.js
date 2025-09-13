const { User, UserSetting } = require('../models');
const { NotFoundError, BadRequestError } = require('../utils/errors');

/**
 * Gets the settings for a given user.
 * If settings do not exist, they are created with default values.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<UserSetting>} The user's settings object.
 */
async function getUserSettings(userId) {
  // User existence is guaranteed by the 'protect' middleware if this is for req.user.id
  // The UserSetting model has userId as PK, so findByPk is appropriate.
  // findOrCreate ensures settings are created if they don't exist.
  const [settings, created] = await UserSetting.findOrCreate({
    where: { userId: userId },
    defaults: {
      userId: userId,
      // Default values for autoUpdateInterval and taskVisualizationPrefs
      // are already defined in the UserSetting model definition.
      // Explicitly setting them here is also fine if needed.
      // autoUpdateInterval: 300, // Default 5 minutes
      // taskVisualizationPrefs: { viewMode: "list", showCompleted: true }
    }
  });

  if (created) {
    // console.log(`Settings created for user ${userId}`);
  }

  return settings;
}

/**
 * Updates the settings for a given user.
 * @param {number} userId - The ID of the user.
 * @param {object} settingsData - The settings data to update.
 *   - {number} [autoUpdateInterval]
 *   - {object} [taskVisualizationPrefs]
 * @returns {Promise<UserSetting>} The updated user's settings object.
 */
async function updateUserSettings(userId, settingsData) {
  const { autoUpdateInterval, taskVisualizationPrefs } = settingsData;

  const settings = await UserSetting.findByPk(userId);
  if (!settings) {
    // This case should ideally not happen if settings are created on registration or first get.
    // But as a fallback, we can create them here too.
    return UserSetting.create({
        userId,
        autoUpdateInterval: autoUpdateInterval !== undefined ? autoUpdateInterval : 300, // model default
        taskVisualizationPrefs: taskVisualizationPrefs || {}, // model default
    });
  }

  let updated = false;
  if (autoUpdateInterval !== undefined) {
    if (typeof autoUpdateInterval !== 'number' || autoUpdateInterval < 0) {
        throw new BadRequestError('Auto update interval must be a non-negative number.');
    }
    settings.autoUpdateInterval = autoUpdateInterval;
    updated = true;
  }

  if (taskVisualizationPrefs !== undefined) {
    // Basic validation: ensure it's an object. More specific validation can be added.
    if (typeof taskVisualizationPrefs !== 'object' || taskVisualizationPrefs === null) {
        throw new BadRequestError('Task visualization preferences must be an object.');
    }
    settings.taskVisualizationPrefs = taskVisualizationPrefs;
    updated = true;
  }

  if (!updated && Object.keys(settingsData).length > 0) {
      throw new BadRequestError('No valid settings fields provided for update.');
  } else if (!updated && Object.keys(settingsData).length === 0) {
      // No data provided, just return current settings
      return settings;
  }


  await settings.save();
  return settings;
}

module.exports = {
  getUserSettings,
  updateUserSettings,
};
