import pool from "../db/db.js";

export async function guardarConfiguracionUsuario(userId, preferencia) {
  await pool.query(
    `
    INSERT INTO configuraciones (usuario_id, preferencia)
    VALUES ($1, $2)
    ON CONFLICT (usuario_id) DO UPDATE SET preferencia = EXCLUDED.preferencia
  `,
    [userId, preferencia]
  );
}

export async function obtenerConfiguracionUsuario(userId) {
  const result = await pool.query(
    "SELECT preferencia FROM configuraciones WHERE usuario_id = $1",
    [userId]
  );
  return result.rows[0]?.preferencia;
}
