// src/models/user.model.js
const db = require('../config/db');

module.exports = {
  // Crea un nuevo usuario y devuelve id, email y timestamps
  create: async ({ email, passwordHash }) => {
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, created_at, updated_at;`,
      [email, passwordHash]
    );
    return rows[0];
  },

  // Busca un usuario por email
  findByEmail: async email => {
    const { rows } = await db.query(
      `SELECT * FROM users WHERE email = $1;`,
      [email]
    );
    return rows[0];
  },

  // Busca un usuario por id
  findById: async id => {
    const { rows } = await db.query(
      `SELECT id, email, created_at, updated_at
       FROM users WHERE id = $1;`,
      [id]
    );
    return rows[0];
  }
};
