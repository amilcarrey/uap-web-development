import { Request, Response } from 'express';
import {
  agregarTareaService,
  eliminarTareaService,
  editarTareaService,
  alternarEstadoService,
  obtenerTareaService,
  limpiarCompletadasService,
  obtenerFiltradoService
} from '../services/tasksService';

export const creartarea = async (req: Request, res: Response) => {
  const { descripcion } = req.body;
  const boardId = Number(req.params.boardId);

  if (!descripcion || typeof descripcion !== 'string' || !descripcion.trim()) {
    return res.status(400).json({ error: 'Descripción requerida' });
  }
  if (isNaN(boardId)) {
    return res.status(400).json({ error: 'ID de tablero inválido' });
  }

  try {
    const nuevaTarea = await agregarTareaService(descripcion.trim(), boardId);
    return res.status(200).json({ task: nuevaTarea });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    return res.status(500).json({ error: 'Error al procesar los datos' });
  }
};

export const borrartarea = async (req: Request, res: Response) => {
  const boardId = Number(req.params.boardId);
  const id = parseInt(req.body.id, 10);

  if (isNaN(boardId) || isNaN(id)) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }

  try {
    await eliminarTareaService(id);
    return res.status(200).json({ mensaje: 'Tarea eliminada' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const editartarea = async (req: Request, res: Response) => {
  const boardId = Number(req.params.boardId);
  const { id, descripcion } = req.body;
  const idNum = Number(id);

  if (isNaN(boardId) || isNaN(idNum) || !descripcion || typeof descripcion !== 'string') {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const tareaEditada = await editarTareaService(idNum, descripcion);
    return res.status(200).json(tareaEditada);
  } catch (error) {
    console.error('Error al editar tarea:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const togle = async (req: Request, res: Response) => {
  const boardId = Number(req.params.boardId);
  const id = parseInt(req.body.id, 10);

  if (isNaN(boardId) || isNaN(id)) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }

  try {
    const tarea = await alternarEstadoService(id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    return res.status(200).json(tarea);
  } catch (error) {
    console.error('Error al alternar estado:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const togleconsult = async (req: Request, res: Response) => {
  const boardId = Number(req.params.boardId);
  const id = parseInt(req.query.id as string, 10);

  if (isNaN(boardId) || isNaN(id)) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }

  try {
    const tarea = await obtenerTareaService(id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    return res.status(200).json({ completada: tarea.completada });
  } catch (error) {
    console.error('Error al consultar estado:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const clearcompleted = async (req: Request, res: Response) => {
  const boardId = Number(req.params.boardId);

  if (isNaN(boardId)) {
    return res.status(400).json({ error: 'ID de tablero inválido' });
  }

  try {
    const eliminadas = await limpiarCompletadasService(boardId);
    return res.status(200).json({ eliminadas });
  } catch (error) {
    console.error('Error al limpiar completadas:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getfiltered = async (req: Request, res: Response) => {
  const boardId = Number(req.params.boardId);
  const filtro = (req.query.filter as string || 'all') as 'all' | 'complete' | 'incomplete';
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '10', 10);

  if (isNaN(boardId) || isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }

  try {
    const tareasFiltradas = await obtenerFiltradoService(boardId, filtro);
    const total = tareasFiltradas.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    return res.status(200).json({
      total,
      totalPages,
      page: currentPage,
      limit,
      data: tareasFiltradas.slice(startIndex, endIndex),
    });
  } catch (error) {
    console.error('Error en getfiltered:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const busquedaTareas = async (req: Request, res: Response) => {
  const boardId = Number(req.params.boardId);
  const query = (req.query.query as string || '').trim();
  const filter = (req.query.filter as string || 'all') as 'all' | 'complete' | 'incomplete';
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '10', 10);

  if (isNaN(boardId) || isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }

  try {
    let tareas = await obtenerFiltradoService(boardId, filter);

    if (query) {
      tareas = tareas.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
    }

    const total = tareas.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * limit;
    const end = start + limit;

    return res.status(200).json({
      total,
      totalPages,
      page: currentPage,
      limit,
      data: tareas.slice(start, end),
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
