// BackendToDo/src/services/permisosService.ts
import { Database } from "../db/connection";
import { AccesoTablero } from "../models/types";

const db = new Database();

// Verificar si un usuario tiene acceso a un tablero
export async function verificarPermisoTablero(usuarioId: string, tableroId: string): Promise<boolean> {
  // 1. Verificar si es propietario
  const esPropietario = await db.query(
    "SELECT * FROM tableros WHERE id = ? AND propietarioId = ?", 
    [tableroId, usuarioId]
  );
  if (esPropietario.length > 0) return true;
  
  // 2. Verificar si el tablero es público
  const esPublico = await db.query(
    "SELECT * FROM tableros WHERE id = ? AND publico = 1", 
    [tableroId]
  );
  if (esPublico.length > 0) return true;
  
  // 3. Verificar si tiene acceso compartido
  const tieneAcceso = await db.query(
    "SELECT * FROM accesos_tablero WHERE idTablero = ? AND idUsuario = ?", 
    [tableroId, usuarioId]
  );
  return tieneAcceso.length > 0;
}

// Verificar si es propietario de un tablero
export async function esPropietarioTablero(usuarioId: string, tableroId: string): Promise<boolean> {
  const resultado = await db.query(
    "SELECT * FROM tableros WHERE id = ? AND propietarioId = ?", 
    [tableroId, usuarioId]
  );
  return resultado.length > 0;
}

// Compartir tablero con rol específico
export async function compartirTablero(tableroId: string, usuarioId: string, rol: 'editor' | 'lector' = 'editor'): Promise<boolean> {
  try {
    const id = `acc-${Date.now()}`;
    await db.run(
      "INSERT INTO accesos_tablero (id, idTablero, idUsuario, rol) VALUES (?, ?, ?, ?)",
      [id, tableroId, usuarioId, rol]
    );
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return true;
    }
    throw error;
  }
}

// Obtener usuario por email
export async function obtenerUsuarioPorEmail(email: string): Promise<any | null> {
  const usuarios = await db.query(
    "SELECT id, nombre, email FROM usuarios WHERE email = ?", 
    [email]
  );
  return usuarios.length > 0 ? usuarios[0] : null;
}

// Obtener usuarios con acceso a un tablero
export async function obtenerUsuariosConAcceso(tableroId: string): Promise<any[]> {
  const query = `
    SELECT u.id, u.nombre, u.email, 
           CASE WHEN t.propietarioId = u.id THEN 1 ELSE 0 END as esPropietario
    FROM usuarios u
    LEFT JOIN tableros t ON t.propietarioId = u.id AND t.id = ?
    LEFT JOIN accesos_tablero a ON a.idUsuario = u.id AND a.idTablero = ?
    WHERE t.propietarioId = u.id OR a.idUsuario = u.id
  `;
  
  return db.query(query, [tableroId, tableroId]);
}

// Revocar acceso a un tablero
export async function revocarAcceso(tableroId: string, usuarioId: string): Promise<boolean> {
  try {
    const result = await db.run(
      "DELETE FROM accesos_tablero WHERE idTablero = ? AND idUsuario = ?",
      [tableroId, usuarioId]
    );
    return result.changes > 0;
  } catch (error) {
    console.error('Error al revocar acceso:', error);
    return false;
  }
}

// Obtener rol del usuario en un tablero específico
export async function obtenerRolUsuario(usuarioId: string, tableroId: string): Promise<'propietario' | 'editor' | 'lector' | null> {
    console.log('🔍 obtenerRolUsuario llamado con:', { usuarioId, tableroId });
    
  // 1. Verificar si es propietario
  const esPropietario = await db.query(
    "SELECT * FROM tableros WHERE id = ? AND propietarioId = ?", 
    [tableroId, usuarioId]
  );
    console.log('👑 Verificando propietario:', { found: esPropietario.length > 0, query: [tableroId, usuarioId] });
  if (esPropietario.length > 0) return 'propietario';
  
  // 2. Verificar si tiene acceso compartido y su rol
  const acceso = await db.query(
    "SELECT rol FROM accesos_tablero WHERE idTablero = ? AND idUsuario = ?", 
    [tableroId, usuarioId]
  );
    console.log('🤝 Verificando acceso compartido:', { found: acceso.length > 0, rol: acceso[0]?.rol });
  if (acceso.length > 0) return acceso[0].rol;
  
  // 3. Verificar si es tablero público
  const esPublico = await db.query(
    "SELECT * FROM tableros WHERE id = ? AND publico = 1", 
    [tableroId]
  );
    console.log('🌍 Verificando tablero público:', { found: esPublico.length > 0 });

  if (esPublico.length > 0) return 'lector'; // Tableros públicos = solo lectura
  
    console.log('❌ Sin acceso al tablero');
  return null; // Sin acceso
}