// services/tareaService.js
import pool from "../db/db.js";

export async function crearTareaService({ nombre, tableroId }) {
  const nuevaTarea = {
    nombre,
    tableroId,
    completada: false,
  };
  const result = await pool.query(
    "INSERT INTO tareas ( nombre, tablero_id, completada) VALUES ($1, $2, $3) RETURNING *",
    [nuevaTarea.nombre, nuevaTarea.tableroId, nuevaTarea.completada]
  );
  return result.rows[0];
}

export async function obtenerTareasService({ tableroId, filtro }) {
  let query = "SELECT * FROM tareas WHERE tablero_id = $1";
  let params = [tableroId];

  if (filtro === "pendientes") {
    query += " AND completada = false";
  } else if (filtro === "completadas") {
    query += " AND completada = true";
  }

  // Ordenar: pendientes primero, luego por fecha de creación
  query += " ORDER BY completada ASC, created_at DESC";

  console.log(` Ejecutando query: ${query} con params:`, params);

  const result = await pool.query(query, params);
  console.log(` Encontradas ${result.rows.length} tareas`);

  return result.rows;
}

export async function eliminarTareaService(id) {
  const result = await pool.query("DELETE FROM tareas WHERE id = $1", [id]);
  return result.rowCount > 0;
}

export async function toggleTareaService(id) {
  // Obtener tarea actual
  const result = await pool.query("SELECT * FROM tareas WHERE id = $1", [id]);
  const tarea = result.rows[0];
  if (!tarea) return null;

  // Cambiar estado
  await pool.query("UPDATE tareas SET completada = $1 WHERE id = $2", [
    !tarea.completada,
    id,
  ]);
  return { ...tarea, completada: !tarea.completada };
}

export async function actualizarTareaService(id, { nombre, completada }) {
  const result = await pool.query("SELECT * FROM tareas WHERE id = $1", [id]);
  const tarea = result.rows[0];
  if (!tarea) return null;

  const updatedTarea = {
    ...tarea,
    nombre: nombre || tarea.nombre,
    completada: completada !== undefined ? completada : tarea.completada,
  };

  await pool.query(
    "UPDATE tareas SET nombre = $1, completada = $2 WHERE id = $3",
    [updatedTarea.nombre, updatedTarea.completada, id]
  );

  return updatedTarea;
}

export async function obtenerTareasFiltradas({
  tableroId,
  pagina = 1,
  limite = 10,
  filtro,
  busqueda,
}) {
  let query = "SELECT * FROM tareas WHERE tablero_id = $1";
  let params = [tableroId];

  if (filtro === "pendientes") {
    query += " AND completada = false";
  } else if (filtro === "completadas") {
    query += " AND completada = true";
  }
  if (busqueda) {
    query += " AND nombre ILIKE $2";
    params.push(`%${busqueda}%`);
  }
  query += " ORDER BY id LIMIT $3 OFFSET $4";
  params.push(limite, (pagina - 1) * limite);

  const result = await pool.query(query, params);
  return result.rows;
}

export async function eliminarTareasCompletadas(tableroId) {
  await pool.query(
    "DELETE FROM tareas WHERE tablero_id = $1 AND completada = true",
    [tableroId]
  );
}
