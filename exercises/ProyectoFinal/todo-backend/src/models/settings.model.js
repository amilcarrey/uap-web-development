// src/models/settings.model.js
const db = require('../config/db');

module.exports = {
  // Obtiene las preferencias del usuario, o {} si no existen
  getByUser: async userId => {
    const { rows } = await db.query(
      `SELECT preferences
       FROM settings
       WHERE user_id = $1`,
      [userId]
    );
    return rows[0]?.preferences || {};
  },

  // Inserta o actualiza las preferencias
  upsert: async ({ userId, preferences }) => {
    const { rows } = await db.query(
      `INSERT INTO settings (user_id, preferences)
       VALUES ($1, $2)
       ON CONFLICT (user_id)
         DO UPDATE SET preferences = EXCLUDED.preferences, updated_at = NOW()
       RETURNING preferences;`,
      [userId, preferences]
    );
    return rows[0].preferences;
  }
};
