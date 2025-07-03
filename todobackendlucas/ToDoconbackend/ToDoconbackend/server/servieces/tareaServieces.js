// server/servieces/tareaServieces.js
import pool from "../db/db.js";

// 1. Listo todas las tareas de un tablero (con paginación, filtro y búsqueda opcional)
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
    `SELECT *, nombre as titulo
     FROM tareas
     ${whereClause}
     ORDER BY creado_en ASC
     LIMIT $${idx++}
     OFFSET $${idx}`,
    [...params, limit, offset]
  );

  return result.rows;
};

// 2. Obtengo una tarea por su ID dentro de un tablero
export const obtenerTareaPorIdService = async (tablero_id, id) => {
  const result = await pool.query(
    `SELECT *, nombre as titulo
     FROM tareas 
     WHERE tablero_id = $1 AND id = $2`,
    [tablero_id, id]
  );
  return result.rows[0] || null;
};

// 3. Creo una nueva tarea
export const crearTareaService = async ({ titulo, tablero_id, creado_por }) => {
  // Valido que los datos requeridos estén presentes
  if (!titulo || tablero_id == null) {
    throw new Error("Faltan datos requeridos");
  }
  
  // En la base de datos uso 'nombre' en lugar de 'titulo'
  // La tabla no tiene columna creado_por, así que no la incluyo
  const result = await pool.query(
    `INSERT INTO tareas (nombre, tablero_id)
     VALUES ($1, $2)
     RETURNING *, nombre as titulo`,
    [titulo, tablero_id]
  );
  return result.rows[0];
};

// 4. Actualizo una tarea existente
export const actualizarTareaService = async (tablero_id, id, { nombre, completada }) => {
  // Construyo la consulta dinámicamente según los campos que se quieren actualizar
  const updates = [];
  const params = [];
  let paramIndex = 1;
  
  if (nombre !== undefined) {
    updates.push(`nombre = $${paramIndex++}`);
    params.push(nombre);
  }
  
  if (completada !== undefined) {
    updates.push(`completada = $${paramIndex++}`);
    params.push(completada);
  }
  
  if (updates.length === 0) {
    throw new Error("No hay campos para actualizar");
  }
  
  // Añado los parámetros para WHERE
  params.push(tablero_id, id);
  
  const result = await pool.query(
    `UPDATE tareas
     SET ${updates.join(', ')}
     WHERE tablero_id = $${paramIndex++} AND id = $${paramIndex}
     RETURNING *, nombre as titulo`,
    params
  );
  return result.rowCount > 0 ? result.rows[0] : null;
};

// 5. Borro todas las tareas completadas de un tablero
export const eliminarTareasCompletasService = async (tablero_id) => {
  const result = await pool.query(
    `DELETE FROM tareas
     WHERE tablero_id = $1 AND completada = true`,
    [tablero_id]
  );
  return result.rowCount;
};

// 6. Elimino una sola tarea
export const eliminarTareaService = async (tablero_id, id) => {
  const result = await pool.query(
    `DELETE FROM tareas 
     WHERE tablero_id = $1 AND id = $2`,
    [tablero_id, id]
  );
  return result.rowCount > 0;
};
