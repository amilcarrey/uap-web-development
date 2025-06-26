import { Database } from "../db/connection";
import { Tarea } from "../models/types";

const db = new Database();

export async function listarTareas(idTablero: string, filtrar?: "completadas" | "pendientes"): Promise<Tarea[]> {
  let query = "SELECT * FROM tareas WHERE idTablero = ?";
  let params = [idTablero];
  
  if (filtrar === "completadas") {
    query += " AND completada = 1";
  } else if (filtrar === "pendientes") {
    query += " AND completada = 0";
  }
  
  return db.query(query, params);
}

export async function agregarTarea(descripcion: string, idTablero: string): Promise<Tarea | null> {
  const existe = await db.query("SELECT * FROM tareas WHERE descripcion = ? AND idTablero = ?", [descripcion, idTablero]);
  if (existe.length > 0) return null;
  
  const query = "INSERT INTO tareas (descripcion, completada, idTablero) VALUES (?, ?, ?)";
  const result = await db.run(query, [descripcion, false, idTablero]);
  
  const tareas = await db.query("SELECT * FROM tareas WHERE id = ?", [result.lastID]);
  return tareas.length > 0 ? tareas[0] as Tarea : null;
}

export async function actualizarEstado(id: number): Promise<boolean> {
  const query = "UPDATE tareas SET completada = NOT completada WHERE id = ?";
  const result = await db.run(query, [id]);
  return result.changes > 0;
}

export async function eliminarTarea(id: number): Promise<boolean> {
  const query = "DELETE FROM tareas WHERE id = ?";
  const result = await db.run(query, [id]);
  return result.changes > 0;
}

export async function eliminarCompletadas(idTablero: string): Promise<number[]> {
  const completadas = await db.query(
    "SELECT id FROM tareas WHERE completada = 1 AND idTablero = ?", 
    [idTablero]
  );
  const ids = completadas.map((t: any) => t.id);

  await db.run(
    "DELETE FROM tareas WHERE completada = 1 AND idTablero = ?", 
    [idTablero]
  );

  return ids;
}

export async function actualizarDescripcion(id: number, nuevaDescripcion: string): Promise<boolean> {
  const query = "UPDATE tareas SET descripcion = ? WHERE id = ?";
  const result = await db.run(query, [nuevaDescripcion, id]);
  return result.changes > 0;
}

export async function obtenerTareaPorId(id: number) {
  const tareas = await db.query("SELECT * FROM tareas WHERE id = ?", [id]);
  return tareas.length > 0 ? tareas[0] : null;
}

export async function buscarTareasPorUsuario(userId: string, texto: string) {
  const query = `
    SELECT tareas.*, tableros.nombre as nombreTablero, tableros.alias as aliasTablero
    FROM tareas
    JOIN tableros ON tareas.idTablero = tableros.id
    LEFT JOIN accesos_tablero a ON a.idTablero = tableros.id
    WHERE (tableros.propietarioId = ? OR a.idUsuario = ?)
      AND tareas.descripcion LIKE ?
    ORDER BY tareas.id DESC
    LIMIT 50
  `;
  return db.query(query, [userId, userId, `%${texto}%`]);
}