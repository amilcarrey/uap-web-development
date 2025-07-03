// server/servieces/permisoServieces.js
import pool from "../db/db.js";

// 1. Compartir un tablero (o actualizar rol si ya existía)
export const compartirTableroService = async (tablero_id, usuario_id, rol) => {
  if (!tablero_id || !usuario_id || !rol) {
    throw new Error("Faltan datos requeridos");
  }
  const { rows } = await pool.query(
    `INSERT INTO permisos (tablero_id, usuario_id, rol)
     VALUES ($1, $2, $3)
     ON CONFLICT (tablero_id, usuario_id) DO UPDATE 
       SET rol = EXCLUDED.rol
     RETURNING *`,
    [tablero_id, usuario_id, rol]
  );
  return rows[0];
};

// 2. Cambiar rol de un permiso existente
export const cambiarRolPermisoService = async (tablero_id, usuario_id, rol) => {
  if (!tablero_id || !usuario_id || !rol) {
    throw new Error("Faltan datos requeridos");
  }
  const { rows, rowCount } = await pool.query(
    `UPDATE permisos
     SET rol = $1
     WHERE tablero_id = $2 AND usuario_id = $3
     RETURNING *`,
    [rol, tablero_id, usuario_id]
  );
  return rowCount > 0 ? rows[0] : null;
};

// 3. Revocar acceso
export const revocarAccesoService = async (tablero_id, usuario_id) => {
  if (!tablero_id || !usuario_id) {
    throw new Error("Faltan datos requeridos");
  }
  const { rowCount } = await pool.query(
    `DELETE FROM permisos
     WHERE tablero_id = $1 AND usuario_id = $2`,
    [tablero_id, usuario_id]
  );
  return rowCount > 0;
};

// 4. Listar todos los permisos de un tablero
export const listarPermisosService = async (tablero_id) => {
  if (!tablero_id) {
    throw new Error("Faltan datos requeridos");
  }
  const { rows } = await pool.query(
    `SELECT p.usuario_id, u.nombre, p.rol
     FROM permisos p
     JOIN usuarios u ON u.id = p.usuario_id
     WHERE p.tablero_id = $1`,
    [tablero_id]
  );
  return rows;
};

// 5. Obtener rol concreto de un usuario en un tablero
export const obtenerRolService = async (tablero_id, usuario_id) => {
  if (!tablero_id || !usuario_id) {
    throw new Error("Faltan datos requeridos");
  }
  const { rows } = await pool.query(
    `SELECT rol 
     FROM permisos
     WHERE tablero_id = $1 AND usuario_id = $2`,
    [tablero_id, usuario_id]
  );
  return rows[0]?.rol || null;
};
