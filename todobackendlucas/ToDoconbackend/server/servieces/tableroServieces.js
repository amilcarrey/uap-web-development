import pool from "../db/db.js";

// Obtener todos los tableros
export const obtenerTablerosService = async () => {
  const result = await pool.query("SELECT * FROM tableros");
  return result.rows;
};

// Obtener tablero por ID
export const obtenerTableroPorIdService = async (id) => {
  const result = await pool.query("SELECT * FROM tableros WHERE id = $1", [id]);
  return result.rows[0];
};

export const crearTableroService = async ({ nombre, descripcion, propietario_id }) => {
  if (!nombre || !descripcion || !propietario_id) {
    throw new Error("Faltan datos requeridos");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // 1) inserta el tablero
    const { rows } = await client.query(
      `INSERT INTO tableros (nombre, descripcion, propietario_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nombre, descripcion, propietario_id]
    );
    const tablero = rows[0];

    // 2) crea el permiso de propietario
    await client.query(
      `INSERT INTO permisos (tablero_id, usuario_id, rol)
       VALUES ($1, $2, 'propietario')`,
      [tablero.id, propietario_id]
    );

    await client.query("COMMIT");
    return tablero;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};


export const actualizarTableroService = async (id, { nombre, descripcion }) => {
  if (!nombre || !descripcion) throw new Error("Faltan datos requeridos");
  const result = await pool.query(
    "UPDATE tableros SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *",
    [nombre, descripcion, id]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
}

export const eliminarTableroService = async (id) => {
  const result = await pool.query("DELETE FROM tableros WHERE id = $1", [id]);
  return result.rowCount > 0;
}
