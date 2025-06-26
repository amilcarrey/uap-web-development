import { Database } from "../db/connection";

const db = new Database();

// Verificar si un usuario tiene acceso a un tablero
export async function verificarPermisoTablero(usuarioId: string, tableroId: string): Promise<boolean> {
  const esPropietario = await db.query(
    "SELECT * FROM tableros WHERE id = ? AND propietarioId = ?", 
    [tableroId, usuarioId]
  );
  if (esPropietario.length > 0) return true;
  
  const esPublico = await db.query(
    "SELECT * FROM tableros WHERE id = ? AND publico = 1", 
    [tableroId]
  );
  if (esPublico.length > 0) return true;
  
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
      await db.run(
        "UPDATE accesos_tablero SET rol = ? WHERE idTablero = ? AND idUsuario = ?",
        [rol, tableroId, usuarioId]
      );
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

// Obtener rol del usuario en un tablero específico
export async function obtenerRolUsuario(usuarioId: string, tableroId: string): Promise<'propietario' | 'editor' | 'lector' | null> {
    
  const esPropietario = await db.query(
    "SELECT * FROM tableros WHERE id = ? AND propietarioId = ?", 
    [tableroId, usuarioId]
  );
    
  const acceso = await db.query(
    "SELECT rol FROM accesos_tablero WHERE idTablero = ? AND idUsuario = ?", 
    [tableroId, usuarioId]
  );
    
  const esPublico = await db.query(
    "SELECT * FROM tableros WHERE id = ? AND publico = 1", 
    [tableroId]
  );

  if (esPropietario.length > 0) {
    return 'propietario';
  }
  if (acceso.length > 0) {
    return acceso[0].rol;
  }
  if (esPublico.length > 0) {
    return 'lector';
  }
  return null; 
}