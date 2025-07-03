import pool from "../db/db.js";

export async function crearTableroService({ name, userId }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Crear el tablero
    const tableroResult = await client.query(
      "INSERT INTO tableros (name, propietario_id) VALUES ($1, $2) RETURNING id",
      [name, userId]
    );

    const tableroId = tableroResult.rows[0].id;

    // Asignar al usuario como propietario en la tabla de permisos
    await client.query(
      "INSERT INTO tablero_usuarios (tablero_id, usuario_id, rol) VALUES ($1, $2, 'propietario')",
      [tableroId, userId]
    );

    await client.query("COMMIT");

    return { id: tableroId, name, userId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function obtenerTablerosService(userId) {
  const result = await pool.query(
    `
    SELECT t.*, tu.rol 
    FROM tableros t 
    INNER JOIN tablero_usuarios tu ON t.id = tu.tablero_id 
    WHERE tu.usuario_id = $1
    ORDER BY t.created_at DESC
  `,
    [userId]
  );
  return result.rows;
}

export async function eliminarTableroService(id) {
  const result = await pool.query("DELETE FROM tableros WHERE id = $1", [id]);
  return result.rowCount > 0;
}
export async function obtenerTableroPorIdService(id) {
  const result = await pool.query("SELECT * FROM tableros WHERE id = $1", [id]);
  return result.rows[0];
}
