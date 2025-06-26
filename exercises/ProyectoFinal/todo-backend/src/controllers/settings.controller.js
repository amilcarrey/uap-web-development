// src/controllers/settings.controller.js
const Settings = require('../models/settings.model');

module.exports = {
  // GET /users/me/settings
  getSettings: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const prefs  = await Settings.getByUser(userId);
      res.json({ preferences: prefs });
    } catch (err) {
      next(err);
    }
  },

  // PUT /users/me/settings
  updateSettings: async (req, res, next) => {
    try {
      const userId      = req.user.id;
      const preferences = req.body.preferences;
      const updated     = await Settings.upsert({ userId, preferences });
      res.json({ preferences: updated });
    } catch (err) {
      next(err);
    }
  }
};
