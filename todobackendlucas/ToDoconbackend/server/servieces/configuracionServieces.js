// server/servieces/configuracionServieces.js
import pool from "../db/db.js";

// 1) Obtener configuración de un usuario (o valores por defecto si no existe)
export const obtenerConfiguracionService = async (usuario_id) => {
  const { rows } = await pool.query(
    `SELECT auto_refresh_interval, view_mode
     FROM configuraciones
     WHERE usuario_id = $1`,
    [usuario_id]
  );
  if (rows.length > 0) return rows[0];
  // si no hay fila, devolvemos valores por defecto
  return { auto_refresh_interval: 60, view_mode: "list" };
};

// 2) Crear o actualizar configuración
export const actualizarConfiguracionService = async (usuario_id, { auto_refresh_interval, view_mode }) => {
  const { rows } = await pool.query(
    `INSERT INTO configuraciones (usuario_id, auto_refresh_interval, view_mode)
     VALUES ($1, $2, $3)
     ON CONFLICT (usuario_id) DO UPDATE
       SET auto_refresh_interval = EXCLUDED.auto_refresh_interval,
           view_mode = EXCLUDED.view_mode
     RETURNING *`,
    [usuario_id, auto_refresh_interval, view_mode]
  );
  return rows[0];
};
