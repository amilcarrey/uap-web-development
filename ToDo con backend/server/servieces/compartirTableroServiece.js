import pool from "../db/db.js";

export async function compartirTableroService(
  tableroId,
  propietarioId,
  usuarioEmail,
  rol
) {
  const tab = await pool.query(
    "SELECT * FROM tableros WHERE id = $1 AND propietario_id = $2",
    [tableroId, propietarioId]
  );

  if (!tab.rows.length) {
    throw new Error("Tablero no encontrado o no autorizado");
  }

  const user = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
    usuarioEmail,
  ]);
  if (user.rowCount === 0) throw new Error("Usuario no encontrado");
  const usuarioId = user.rows[0].id;

  await pool.query(
    "INSERT INTO tablero_usuarios (usuario_id, tablero_id, rol) VALUES ($1, $2, $3)",
    [usuarioId, tableroId, rol]
  );
}

export async function obtenerTablerosCompartidosServieces(usuarioId) {
  const tableros = await pool.query(
    "SELECT * FROM tablero_usuarios WHERE usuario_id = $1",
    [usuarioId]
  );
  return tableros.rows;
}
