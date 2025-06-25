import { Database } from "../db/connection";
import { Tablero } from "../models/types";

const db = new Database();

export async function agregarTablero(nombre: string, alias: string, propietarioId?: string): Promise<Tablero | null> {
  try {
    // Verificar si ya existe
    const existe = await db.query("SELECT * FROM tableros WHERE alias = ?", [alias]);
    if (existe.length > 0) return null;

    const id = `tb-${Date.now()}`;
    
    // Incluir propietarioId en la inserción
    const query = "INSERT INTO tableros (id, nombre, alias, propietarioId) VALUES (?, ?, ?, ?)";
    await db.run(query, [id, nombre, alias, propietarioId || null]);
    
    // Retornar el tablero creado
    const tableros = await db.query("SELECT * FROM tableros WHERE id = ?", [id]);
    return tableros.length > 0 ? tableros[0] as Tablero : null;
  } catch (error) {
    console.error('❌ Error en agregarTablero:', error); 
    throw error;
  }
}

export async function listarTableros(): Promise<Tablero[]> {
  return db.query("SELECT * FROM tableros");
}

export async function eliminarTablero(id: string): Promise<boolean> {
  // Verificar que existe
  const tableroExiste = await db.query("SELECT * FROM tableros WHERE id = ?", [id]);
  if (tableroExiste.length === 0) return false;
  
  // Eliminar todas las tareas asociadas al tablero primero
  await db.run("DELETE FROM tareas WHERE idTablero = ?", [id]);
  
  // Eliminar el tablero
  const result = await db.run("DELETE FROM tableros WHERE id = ?", [id]);
  return result.changes > 0;
}

export async function obtenerTablero(alias: string): Promise<Tablero | null> {
  const tableros = await db.query("SELECT * FROM tableros WHERE alias = ?", [alias]);
  return tableros.length > 0 ? tableros[0] as Tablero : null;
}

export async function obtenerTableroPorId(id: string): Promise<Tablero | null> {
  const tableros = await db.query("SELECT * FROM tableros WHERE id = ?", [id]);
  return tableros.length > 0 ? tableros[0] as Tablero : null;
}

export async function listarTablerosDeUsuario(userId: string) {
  return db.query(`
    SELECT DISTINCT t.*
    FROM tableros t
    LEFT JOIN accesos_tablero a ON a.idTablero = t.id
    WHERE t.propietarioId = ?
       OR a.idUsuario = ?
       OR t.publico = 1
  `, [userId, userId]);
}