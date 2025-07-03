// server/servieces/tareaServieces.js
import pool from "../db/db.js";

// 1. Listar todas las tareas de un tablero (con paginación, filtro y búsqueda opcional)
export const obtenerTareasService = async ({ tablero_id, page, limit, completada, search }) => {
  const offset = (page - 1) * limit;
  const conditions = ["tablero_id = $1"];
  const params = [tablero_id];
  let idx = 2;

  if (completada !== undefined) {
    conditions.push(`completada = $${idx++}`);
    params.push(completada === "true");
  }
  if (search) {
    conditions.push(`nombre ILIKE $${idx++}`);
    params.push(`%${search}%`);
  }

  const whereClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";

  const result = await pool.query(
    `SELECT *
     FROM tareas
     ${whereClause}
     ORDER BY creado_en ASC
     LIMIT $${idx++}
     OFFSET $${idx}`,
    [...params, limit, offset]
  );

  return result.rows;
};

// 2. Obtener una tarea por su ID dentro de un tablero
export const obtenerTareaPorIdService = async (tablero_id, id) => {
  const result = await pool.query(
    `SELECT * 
     FROM tareas 
     WHERE tablero_id = $1 AND id = $2`,
    [tablero_id, id]
  );
  return result.rows[0] || null;
};

// 3. Crear una nueva tarea
export const crearTareaService = async ({ nombre, tablero_id }) => {
  if (!nombre || tablero_id == null) {
    throw new Error("Faltan datos requeridos");
  }
  const result = await pool.query(
    `INSERT INTO tareas (nombre, tablero_id)
     VALUES ($1, $2)
     RETURNING *`,
    [nombre, tablero_id]
  );
  return result.rows[0];
};

// 4. Actualizar una tarea existente
export const actualizarTareaService = async (tablero_id, id, { nombre, completada }) => {
  if (nombre == null || completada == null) {
    throw new Error("Faltan datos requeridos");
  }
  const result = await pool.query(
    `UPDATE tareas
     SET nombre = $1, completada = $2
     WHERE tablero_id = $3 AND id = $4
     RETURNING *`,
    [nombre, completada, tablero_id, id]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
};

// 5. Borrar todas las tareas completadas de un tablero
export const eliminarTareasCompletasService = async (tablero_id) => {
  const result = await pool.query(
    `DELETE FROM tareas
     WHERE tablero_id = $1 AND completada = true`,
    [tablero_id]
  );
  return result.rowCount;
};

// 6. Eliminar una sola tarea
export const eliminarTareaService = async (tablero_id, id) => {
  const result = await pool.query(
    `DELETE FROM tareas 
     WHERE tablero_id = $1 AND id = $2`,
    [tablero_id, id]
  );
  return result.rowCount > 0;
};
