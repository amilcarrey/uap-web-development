// src/models/board.model.js
const db = require('../config/db');

module.exports = {
  // Crea un tablero
  create: async ({ name, ownerId }) => {
    const { rows } = await db.query(
      `INSERT INTO boards (name, owner_id)
       VALUES ($1, $2)
       RETURNING id, name, owner_id, created_at, updated_at;`,
      [name, ownerId]
    );
    return rows[0];
  },

  // Obtiene un tablero por id (si el usuario tiene permisos, el middleware lo comprobará)
  getById: async id => {
    const { rows } = await db.query(
      `SELECT id, name, owner_id, created_at, updated_at
       FROM boards WHERE id = $1;`,
      [id]
    );
    return rows[0];
  },

  // Lista todos los tableros en los que el usuario tiene algún permiso
  listByUser: async userId => {
    const { rows } = await db.query(
      `SELECT b.id, b.name, b.owner_id, p.role, b.created_at, b.updated_at
       FROM boards b
       JOIN permissions p ON b.id = p.board_id
       WHERE p.user_id = $1
       ORDER BY b.created_at DESC;`,
      [userId]
    );
    return rows;
  },

  // Actualiza nombre de un tablero
  update: async ({ id, name }) => {
    const { rows } = await db.query(
      `UPDATE boards
       SET name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, name, owner_id, created_at, updated_at;`,
      [name, id]
    );
    return rows[0];
  },

  // Elimina un tablero
  remove: async id => {
    await db.query(
      `DELETE FROM boards WHERE id = $1;`,
      [id]
    );
    return true;
  }
};
