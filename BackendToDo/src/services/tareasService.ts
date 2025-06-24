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
  // Verificar si ya existe
  const existe = await db.query("SELECT * FROM tareas WHERE descripcion = ? AND idTablero = ?", [descripcion, idTablero]);
  if (existe.length > 0) return null;
  
  const query = "INSERT INTO tareas (descripcion, completada, idTablero) VALUES (?, ?, ?)";
  const result = await db.run(query, [descripcion, false, idTablero]);
  
  // Retornar la tarea creada
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
  // Obtener IDs antes de eliminar (solo del tablero específico)
  const completadas = await db.query("SELECT id FROM tareas WHERE completada = 1 AND idTablero = ?", [idTablero]);
  const ids = completadas.map(t => t.id);
  
  // Eliminar solo las completadas del tablero específico
  await db.run("DELETE FROM tareas WHERE completada = 1 AND idTablero = ?", [idTablero]);
  return ids;
}

export async function actualizarDescripcion(id: number, nuevaDescripcion: string): Promise<boolean> {
  const query = "UPDATE tareas SET descripcion = ? WHERE id = ?";
  const result = await db.run(query, [nuevaDescripcion, id]);
  return result.changes > 0;
}

export async function obtenerTareaPorId(id: number) {
  const tareas = await db.query("SELECT * FROM tareas WHERE id = ?", [id]);
  console.log('Buscando tarea', id, '->', tareas);
  return tareas.length > 0 ? tareas[0] : null;
}