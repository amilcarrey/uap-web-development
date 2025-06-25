import { Request, Response } from 'express'
import db from '../db'
import { randomUUID } from 'crypto'

// trae todos los tableros del usuario logueado
export const obtenerTableros = (req: Request, res: Response): void => {
  const usuarioId = req.usuario?.id

  if (!usuarioId) {
    res.status(401).json({ error: 'No autorizado' })
    return
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
  `).all(usuarioId, usuarioId, usuarioId, usuarioId)

  res.json(tableros)
}

// crear un tablero nuevo
export const crearTablero = (req: Request, res: Response): void => {
  const { nombre } = req.body
  const usuarioId = req.usuario?.id

  if (!usuarioId || !nombre) {
    res.status(400).json({ error: 'Faltan datos' })
    return
  }

  const tableroId = randomUUID()
  db.prepare('INSERT INTO tableros (id, nombre, propietarioId) VALUES (?, ?, ?)').run(tableroId, nombre, usuarioId)

  db.prepare(`
    INSERT INTO permisos_tablero (id, tableroId, usuarioId, rol)
    VALUES (?, ?, ?, ?)
  `).run(randomUUID(), tableroId, usuarioId, 'propietario')

  res.status(201).json({ id: tableroId, nombre })
}

// eliminar tablero y todo lo relacionado
export const eliminarTablero = (req: Request, res: Response): void => {
  const { id } = req.params

  try {
    db.prepare('DELETE FROM tareas WHERE tableroId = ?').run(id)
    db.prepare('DELETE FROM permisos_tablero WHERE tableroId = ?').run(id)
    db.prepare('DELETE FROM tableros WHERE id = ?').run(id)
    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el tablero' })
  }
}

// trae un tablero por id
export const obtenerTableroPorId = (req: Request, res: Response): void => {
  const { id } = req.params
  const tablero = db.prepare('SELECT * FROM tableros WHERE id = ?').get(id)

  if (!tablero) {
    res.status(404).json({ error: 'Tablero no encontrado' })
    return
  }

  res.json(tablero)
}

// compartir tablero con otro usuario
export const compartirTablero = (req: Request, res: Response) => {
  const usuarioActualId = req.usuario?.id
  const tableroId = req.params.id
  const { email, rol } = req.body

  if (!usuarioActualId || !email || !rol) {
    res.status(400).json({ error: 'Faltan datos requeridos' })
    return
  }

  const esPropietario = db.prepare(`
  SELECT 1 FROM tableros
  WHERE id = ? AND propietarioId = ?
`).get(tableroId, usuarioActualId);

  if (!esPropietario) {
    res.status(403).json({ error: 'Solo el propietario puede compartir el tablero' });
    return;
  }


  const usuarioDestino = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email) as { id: string } | undefined

  if (!usuarioDestino) {
    res.status(404).json({ error: 'Usuario no encontrado' })
    return
  }

  const permisoExistente = db.prepare(`
  SELECT id FROM permisos_tablero
  WHERE tableroId = ? AND usuarioId = ?
`).get(tableroId, usuarioDestino.id);

  if (permisoExistente) {
    db.prepare(`
    UPDATE permisos_tablero SET rol = ?
    WHERE tableroId = ? AND usuarioId = ?
  `).run(rol, tableroId, usuarioDestino.id);
  } else {
    db.prepare(`
    INSERT INTO permisos_tablero (id, tableroId, usuarioId, rol)
    VALUES (?, ?, ?, ?)
  `).run(randomUUID(), tableroId, usuarioDestino.id, rol);
  }

  res.status(200).json({ mensaje: 'Permiso asignado o actualizado correctamente' });
}

// modificar el rol de un usuario en un tablero
export const modificarPermiso = (req: Request, res: Response) => {
  const propietarioId = req.usuario?.id
  const tableroId = req.params.id
  const { usuarioId, nuevoRol } = req.body

  if (!propietarioId || !usuarioId || !nuevoRol) {
    res.status(400).json({ error: 'Faltan datos requeridos' })
    return
  }

  const esPropietario = db.prepare(`
    SELECT rol FROM permisos_tablero
    WHERE tableroId = ? AND usuarioId = ?
  `).get(tableroId, propietarioId) as { rol: string } | undefined

  if (!esPropietario || esPropietario.rol !== 'propietario') {
    res.status(403).json({ error: 'No autorizado' })
    return
  }

  const result = db.prepare(`
    UPDATE permisos_tablero SET rol = ?
    WHERE tableroId = ? AND usuarioId = ?
  `).run(nuevoRol, tableroId, usuarioId)

  if (result.changes === 0) {
    res.status(404).json({ error: 'Permiso no encontrado' })
    return
  }

  res.json({ mensaje: 'Rol actualizado correctamente' })
}

// trae los usuarios que tienen permisos en el tablero (menos el propietario)
export const obtenerUsuariosConPermisos = (req: Request, res: Response): void => {
  const propietarioId = req.usuario?.id
  const tableroId = req.params.id

  if (!propietarioId || !tableroId) {
    res.status(400).json({ error: 'Faltan datos requeridos' })
    return
  }

  const permiso = db.prepare(`
    SELECT rol FROM permisos_tablero
    WHERE tableroId = ? AND usuarioId = ?
  `).get(tableroId, propietarioId) as { rol: string } | undefined

  if (!permiso || permiso.rol !== 'propietario') {
    res.status(403).json({ error: 'No autorizado' })
    return
  }

  const usuarios = db.prepare(`
    SELECT u.id as usuarioId, u.nombre, p.rol
    FROM permisos_tablero p
    JOIN usuarios u ON p.usuarioId = u.id
    WHERE p.tableroId = ? AND p.usuarioId != ?
  `).all(tableroId, propietarioId) as {
    usuarioId: string
    nombre: string
    rol: 'editor' | 'lectura'
  }[]

  res.json({ usuarios })
}
