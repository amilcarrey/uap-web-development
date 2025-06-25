import { Request, Response } from 'express'
import db from '../db'
import { randomUUID } from 'crypto'

// trae las tareas según filtro, paginado y tablero
export const obtenerTareas = (req: Request, res: Response): void => {
  const { filtro = 'todas', pagina = '1', limit = '5', tableroId } = req.query

  // si no viene el id del tablero, corto
  if (!tableroId || typeof tableroId !== 'string') {
    res.status(400).json({ error: 'Falta tableroId' })
    return
  }

  // convierto pag y limit a número
  const paginaNumero = Number(pagina)
  const limitNumero = Number(limit)

  // si no son números válidos, chau
  if (isNaN(paginaNumero) || isNaN(limitNumero) || paginaNumero < 1 || limitNumero < 1) {
    res.status(400).json({ error: 'pagina y limit deben ser números positivos' })
    return
  }

  // calculo el offset para la paginación
  const offset = (paginaNumero - 1) * limitNumero

  // armo el where según filtro
  let where = 'WHERE tableroId = ?'
  if (filtro === 'completas') {
    where += ' AND completada = 1'
  } else if (filtro === 'incompletas') {
    where += ' AND completada = 0'
  }

  try {
    // traigo las tareas
    const stmt = db.prepare(`
      SELECT * FROM tareas ${where}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `)
    const tareas = stmt.all(tableroId, limitNumero, offset).map((t: any) => ({
      ...t,
      completada: Boolean(t.completada),
    }))

    // traigo el total para la paginación
    const totalResult = db.prepare(`
      SELECT COUNT(*) as total FROM tareas ${where}
    `).get(tableroId) as { total: number }

    res.json({ tareas, total: totalResult.total })
  } catch (error) {
    console.error('Error al obtener tareas:', error)
    res.status(500).json({ error: 'Error al obtener tareas' })
  }
}

// agrega una tarea nueva
export const agregarTarea = (req: Request, res: Response): void => {
  const { texto, tableroId } = req.body

  // si falta texto o tablero, chau
  if (!texto || !tableroId) {
    res.status(400).json({ error: 'Faltan datos' })
    return
  }

  // genero id y guardo la tarea
  const id = randomUUID()

  db.prepare(`
    INSERT INTO tareas (id, texto, completada, tableroId)
    VALUES (?, ?, 0, ?)
  `).run(id, texto, tableroId)

  // devuelvo la tarea recién creada
  const nuevaTarea = db.prepare('SELECT * FROM tareas WHERE id = ?').get(id) as any
  nuevaTarea.completada = Boolean(nuevaTarea.completada)

  res.status(201).json(nuevaTarea)
}

// alterna completada/no completada
export const toggleTarea = (req: Request, res: Response): void => {
  const { id } = req.params

  // busco la tarea
  const tarea = db.prepare('SELECT completada FROM tareas WHERE id = ?').get(id) as { completada: number } | undefined
  if (!tarea) {
    res.status(404).json({ error: 'Tarea no encontrada' })
    return
  }

  // cambio el valor y actualizo
  const nuevoValor = tarea.completada ? 0 : 1
  db.prepare('UPDATE tareas SET completada = ? WHERE id = ?').run(nuevoValor, id)

  // devuelvo la tarea actualizada
  const actualizada = db.prepare('SELECT * FROM tareas WHERE id = ?').get(id) as any
  actualizada.completada = Boolean(actualizada.completada)

  res.json(actualizada)
}

// edita el texto de una tarea
export const editarTarea = (req: Request, res: Response): void => {
  const { id } = req.params
  const { texto } = req.body

  // si no hay texto, chau
  if (!texto || typeof texto !== 'string') {
    res.status(400).json({ error: 'Texto inválido' })
    return
  }

  // actualizo la tarea
  const result = db.prepare('UPDATE tareas SET texto = ? WHERE id = ?').run(texto, id)

  // si no se encontró, aviso
  if (result.changes === 0) {
    res.status(404).json({ error: 'Tarea no encontrada para editar' })
    return
  }

  // devuelvo la tarea editada
  const actualizada = db.prepare('SELECT * FROM tareas WHERE id = ?').get(id) as any
  actualizada.completada = Boolean(actualizada.completada)

  res.json(actualizada)
}

// borra una tarea por id
export const borrarTarea = (req: Request, res: Response): void => {
  const { id } = req.params

  // intento borrar
  const result = db.prepare('DELETE FROM tareas WHERE id = ?').run(id)

  // si no se borró nada, no existe
  if (result.changes === 0) {
    res.status(404).json({ error: 'Tarea no encontrada' })
    return
  }

  res.sendStatus(204)
}

// borra todas las tareas completadas de un tablero (solo si sos editor o propietario)
export const limpiarTareasCompletadas = (req: Request, res: Response): void => {
  const { tableroId } = req.params
  const usuarioId = req.usuario?.id

  // si no hay usuario, chau
  if (!usuarioId) {
    res.status(401).json({ error: 'No autorizado' })
    return
  }

  // veo si tiene permiso
  const permiso = db.prepare(`
    SELECT rol FROM permisos_tablero
    WHERE tableroId = ? AND usuarioId = ?
  `).get(tableroId, usuarioId) as { rol: string } | undefined

  // si no es editor o propietario, chau
  if (!permiso || (permiso.rol !== 'editor' && permiso.rol !== 'propietario')) {
    res.status(403).json({ error: 'No tienes permiso para modificar tareas' })
    return
  }

  // borro las tareas completadas
  const info = db.prepare(`
    DELETE FROM tareas
    WHERE tableroId = ? AND completada = 1
  `).run(tableroId)

  res.json({ eliminadas: info.changes })
}
