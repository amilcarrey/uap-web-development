import { Request, Response } from 'express';
import db from '../db';
import { randomUUID } from 'crypto';

export const obtenerTableros = (req: Request, res: Response): void => {
  const usuarioId = req.usuario?.id;

  if (!usuarioId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  const tableros = db.prepare(`
    SELECT t.id, t.nombre,
      CASE
        WHEN t.propietarioId = ? THEN 'propietario'
        ELSE p.rol
      END as rol
    FROM tableros t
    LEFT JOIN permisos_tablero p ON t.id = p.tableroId AND p.usuarioId = ?
    WHERE t.propietarioId = ? OR p.usuarioId = ?
    GROUP BY t.id
    ORDER BY t.nombre
  `).all(usuarioId, usuarioId, usuarioId, usuarioId);

  res.json(tableros);
};

export const crearTablero = (req: Request, res: Response): void => {
  const { nombre } = req.body;
  const usuarioId = req.usuario?.id; // <- Esto requiere middleware auth

  if (!usuarioId || !nombre) {
    res.status(400).json({ error: 'Faltan datos' });
    return;
  }

  const tableroId = randomUUID();
  db.prepare('INSERT INTO tableros (id, nombre, propietarioId) VALUES (?, ?, ?)').run(tableroId, nombre, usuarioId);


  // Registrar el permiso del usuario como propietario
  db.prepare(`
    INSERT INTO permisos_tablero (id, tableroId, usuarioId, rol)
    VALUES (?, ?, ?, ?)
  `).run(randomUUID(), tableroId, usuarioId, 'propietario');

  res.status(201).json({ id: tableroId, nombre });
};

export const eliminarTablero = (req: Request, res: Response): void => {
  const { id } = req.params;
  console.log('🔴 Intentando eliminar tablero:', id);

  try {
    db.prepare('DELETE FROM tareas WHERE tableroId = ?').run(id);
    db.prepare('DELETE FROM permisos_tablero WHERE tableroId = ?').run(id);
    db.prepare('DELETE FROM tableros WHERE id = ?').run(id);

    console.log('✅ Eliminación exitosa');
    res.sendStatus(204);
  } catch (error) {
    console.error('❌ Error al eliminar tablero:', error);
    res.status(500).json({ error: 'No se pudo eliminar el tablero' });
  }
};


export const obtenerTableroPorId = (req: Request, res: Response): void => {
  const { id } = req.params;
  const tablero = db.prepare('SELECT * FROM tableros WHERE id = ?').get(id);

  if (!tablero) {
    res.status(404).json({ error: 'Tablero no encontrado' });
    return;
  }

  res.json(tablero);
};

export const compartirTablero = (req: Request, res: Response) => {
  const usuarioActualId = req.usuario?.id;
  const tableroId = req.params.id;
  const { email, rol } = req.body;

  if (!usuarioActualId || !email || !rol) {
    res.status(400).json({ error: 'Faltan datos requeridos' });
    return;
  }

  // Verificar que el usuario actual sea propietario del tablero
  const permiso = db.prepare(`
    SELECT rol FROM permisos_tablero
    WHERE tableroId = ? AND usuarioId = ?
  `).get(tableroId, usuarioActualId) as { rol: string } | undefined;

  if (!permiso || permiso.rol !== 'propietario') {
    res.status(403).json({ error: 'Solo el propietario puede compartir el tablero' });
    return;
  }

  // Buscar usuario por email
  const usuarioDestino = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email) as { id: string } | undefined;

  if (!usuarioDestino) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }

  // Verificar si ya tiene un permiso
  const yaExiste = db.prepare(`
    SELECT id FROM permisos_tablero
    WHERE tableroId = ? AND usuarioId = ?
  `).get(tableroId, usuarioDestino.id);

  if (yaExiste) {
    res.status(400).json({ error: 'Este usuario ya tiene acceso al tablero' });
    return;
  }

  // Insertar permiso
  db.prepare(`
    INSERT INTO permisos_tablero (id, tableroId, usuarioId, rol)
    VALUES (?, ?, ?, ?)
  `).run(randomUUID(), tableroId, usuarioDestino.id, rol);

  res.status(201).json({ mensaje: 'Acceso concedido' });
};

export const modificarPermiso = (req: Request, res: Response) => {
  const propietarioId = req.usuario?.id;
  const tableroId = req.params.id;
  const { usuarioId, nuevoRol } = req.body;

  if (!propietarioId || !usuarioId || !nuevoRol) {
    res.status(400).json({ error: 'Faltan datos requeridos' });
    return;
  }

  // Solo el propietario puede modificar permisos
  const esPropietario = db.prepare(`
    SELECT rol FROM permisos_tablero
    WHERE tableroId = ? AND usuarioId = ?
  `).get(tableroId, propietarioId) as { rol: string } | undefined;

  if (!esPropietario || esPropietario.rol !== 'propietario') {
    res.status(403).json({ error: 'No autorizado' });
    return;
  }

  // Actualizar rol
  const result = db.prepare(`
    UPDATE permisos_tablero SET rol = ?
    WHERE tableroId = ? AND usuarioId = ?
  `).run(nuevoRol, tableroId, usuarioId);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Permiso no encontrado' });
    return;
  }

  res.json({ mensaje: 'Rol actualizado correctamente' });
};

export const obtenerUsuariosConPermisos = (req: Request, res: Response): void => {
  const propietarioId = req.usuario?.id;
  const tableroId = req.params.id;

  if (!propietarioId || !tableroId) {
    res.status(400).json({ error: 'Faltan datos requeridos' });
    return;
  }

  const permiso = db.prepare(`
    SELECT rol FROM permisos_tablero
    WHERE tableroId = ? AND usuarioId = ?
  `).get(tableroId, propietarioId) as { rol: string } | undefined;

  if (!permiso || permiso.rol !== 'propietario') {
    res.status(403).json({ error: 'No autorizado' });
    return;
  }

  const usuarios = db.prepare(`
    SELECT u.id as usuarioId, u.nombre, p.rol
    FROM permisos_tablero p
    JOIN usuarios u ON p.usuarioId = u.id
    WHERE p.tableroId = ? AND p.usuarioId != ?
  `).all(tableroId, propietarioId) as {
    usuarioId: string;
    nombre: string;
    rol: 'editor' | 'lectura';
  }[];

  res.json({ usuarios });
};
