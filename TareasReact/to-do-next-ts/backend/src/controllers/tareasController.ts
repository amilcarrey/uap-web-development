import { Request, Response } from 'express';
import db from '../db';
import { randomUUID } from 'crypto';

export const obtenerTareas = (req: Request, res: Response): void => {
  const { filtro = 'todas', pagina = '1', limit = '5', tableroId } = req.query;

  // Validación de tableroId
  if (!tableroId || typeof tableroId !== 'string') {
    res.status(400).json({ error: 'Falta tableroId' });
    return;
  }

  // Validación de pagina y limit
  const paginaNumero = Number(pagina);
  const limitNumero = Number(limit);

  if (isNaN(paginaNumero) || isNaN(limitNumero) || paginaNumero < 1 || limitNumero < 1) {
    res.status(400).json({ error: 'pagina y limit deben ser números positivos' });
    return;
  }

  const offset = (paginaNumero - 1) * limitNumero;

  let where = 'WHERE tableroId = ?';
  if (filtro === 'completas') {
    where += ' AND completada = 1';
  } else if (filtro === 'incompletas') {
    where += ' AND completada = 0';
  }

  try {
    const stmt = db.prepare(`
      SELECT * FROM tareas ${where}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `);
    const tareas = stmt.all(tableroId, limitNumero, offset).map((t: any) => ({
      ...t,
      completada: Boolean(t.completada),
    }));

    const totalResult = db.prepare(`
      SELECT COUNT(*) as total FROM tareas ${where}
    `).get(tableroId) as { total: number };

    res.json({ tareas, total: totalResult.total });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};


export const agregarTarea = (req: Request, res: Response): void => {
  const { texto, tableroId } = req.body;

  if (!texto || !tableroId) {
    res.status(400).json({ error: 'Faltan datos' });
    return;
  }

  const id = randomUUID();

  db.prepare(`
    INSERT INTO tareas (id, texto, completada, tableroId)
    VALUES (?, ?, 0, ?)
  `).run(id, texto, tableroId);

  const nuevaTarea = db.prepare('SELECT * FROM tareas WHERE id = ?').get(id) as any;
  nuevaTarea.completada = Boolean(nuevaTarea.completada);

  res.status(201).json(nuevaTarea);
};

export const toggleTarea = (req: Request, res: Response): void => {
  const { id } = req.params;

  const tarea = db.prepare('SELECT completada FROM tareas WHERE id = ?').get(id) as { completada: number } | undefined;
  if (!tarea) {
    res.status(404).json({ error: 'Tarea no encontrada' });
    return;
  }

  const nuevoValor = tarea.completada ? 0 : 1;
  db.prepare('UPDATE tareas SET completada = ? WHERE id = ?').run(nuevoValor, id);

  const actualizada = db.prepare('SELECT * FROM tareas WHERE id = ?').get(id) as any;
  actualizada.completada = Boolean(actualizada.completada);

  res.json(actualizada);
};

export const editarTarea = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { texto } = req.body;

  if (!texto || typeof texto !== 'string') {
    res.status(400).json({ error: 'Texto inválido' });
    return;
  }

  const result = db.prepare('UPDATE tareas SET texto = ? WHERE id = ?').run(texto, id);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Tarea no encontrada para editar' });
    return;
  }

  const actualizada = db.prepare('SELECT * FROM tareas WHERE id = ?').get(id) as any;
  actualizada.completada = Boolean(actualizada.completada);

  res.json(actualizada);
};

export const borrarTarea = (req: Request, res: Response): void => {
  const { id } = req.params;

  const result = db.prepare('DELETE FROM tareas WHERE id = ?').run(id);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Tarea no encontrada' });
    return;
  }

  res.sendStatus(204);
};

export const limpiarTareasCompletadas = (req: Request, res: Response): void => {
  const { tableroId } = req.params;
  const usuarioId = req.usuario?.id;

  if (!usuarioId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  // Verificar si el usuario tiene permisos suficientes
const permiso = db.prepare(`
  SELECT rol FROM permisos_tablero
  WHERE tableroId = ? AND usuarioId = ?
`).get(tableroId, usuarioId) as { rol: string } | undefined;


  if (!permiso || (permiso.rol !== 'editor' && permiso.rol !== 'propietario')) {
    res.status(403).json({ error: 'No tienes permiso para modificar tareas' });
    return;
  }

  // Eliminar tareas completadas
  const info = db.prepare(`
    DELETE FROM tareas
    WHERE tableroId = ? AND completada = 1
  `).run(tableroId);

  res.json({ eliminadas: info.changes });
};
