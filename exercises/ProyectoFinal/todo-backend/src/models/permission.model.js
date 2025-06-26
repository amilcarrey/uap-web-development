// src/models/permission.model.js
const db = require('../config/db');

/**
 * Inserta o actualiza (upsert) un permiso de usuario en un tablero
 */
async function upsert({ userId, boardId, role }) {
  const { rows } = await db.query(
    `INSERT INTO permissions (user_id, board_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, board_id)
       DO UPDATE SET role = EXCLUDED.role, updated_at = NOW()
     RETURNING id, user_id, board_id, role, created_at, updated_at;`,
    [userId, boardId, role]
  );
  return rows[0];
}

/**
 * Devuelve el rol de un usuario en un tablero, o null si no existe
 */
async function getRole({ userId, boardId }) {
  const { rows } = await db.query(
    `SELECT role
     FROM permissions
     WHERE user_id = $1 AND board_id = $2;`,
    [userId, boardId]
  );
  return rows[0]?.role || null;
}

/**
 * Elimina el permiso de un usuario en un tablero
 */
async function remove({ userId, boardId }) {
  await db.query(
    `DELETE FROM permissions
     WHERE user_id = $1 AND board_id = $2;`,
    [userId, boardId]
  );
  return true;
}

module.exports = {
  // Alias para usar grant/revoke como en los controladores
  grant:  upsert,
  revoke: remove,

  // Exportaciones originales
  upsert,
  getRole,
  remove
};
