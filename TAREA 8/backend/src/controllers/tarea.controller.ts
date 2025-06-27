import { Request, Response } from 'express';
import {
  crearTarea,
  obtenerTareas,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  eliminarTareasCompletadas,
  marcarVariasComoCompletadas,
  obtenerEstadisticasTablero
} from '../services/tarea.service';

export async function crearTareaHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { tableroId } = req.params;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (!tableroId) {
      res.status(400).json({ error: 'ID del tablero requerido' });
      return;
    }

    const tarea = await crearTarea(tableroId, usuarioId, req.body);
    res.status(201).json({
      mensaje: 'Tarea creada exitosamente',
      tarea
    });
  } catch (error: any) {
    if (error.message === 'Tablero no encontrado') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'No tienes permisos para realizar esta acción') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}

export async function obtenerTareasHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { tableroId } = req.params;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (!tableroId) {
      res.status(400).json({ error: 'ID del tablero requerido' });
      return;
    }


    const filtros = {
      completada: req.query.completada ? req.query.completada === 'true' : undefined,
      prioridad: req.query.prioridad as any,
      busqueda: req.query.busqueda as string,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      ordenarPor: req.query.ordenarPor as any,
      orden: req.query.orden as 'asc' | 'desc'
    };

    const resultado = await obtenerTareas(tableroId, usuarioId, filtros);
    res.status(200).json(resultado);
  } catch (error: any) {
    if (error.message === 'Tablero no encontrado') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'No tienes permisos para realizar esta acción') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

export async function obtenerTareaHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { id } = req.params;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const tarea = await obtenerTarea(id, usuarioId);
    res.status(200).json({ tarea });
  } catch (error: any) {
    if (error.message === 'Tarea no encontrada' || error.message === 'Tablero no encontrado') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'No tienes permisos para realizar esta acción') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

export async function actualizarTareaHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { id } = req.params;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const tarea = await actualizarTarea(id, usuarioId, req.body);
    res.status(200).json({
      mensaje: 'Tarea actualizada exitosamente',
      tarea
    });
  } catch (error: any) {
    if (error.message === 'Tarea no encontrada' || error.message === 'Tablero no encontrado') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'No tienes permisos para realizar esta acción') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}

export async function eliminarTareaHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { id } = req.params;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const resultado = await eliminarTarea(id, usuarioId);
    res.status(200).json(resultado);
  } catch (error: any) {
    if (error.message === 'Tarea no encontrada' || error.message === 'Tablero no encontrado') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'No tienes permisos para realizar esta acción') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

export async function eliminarTareasCompletadasHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { tableroId } = req.params;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const resultado = await eliminarTareasCompletadas(tableroId, usuarioId);
    res.status(200).json(resultado);
  } catch (error: any) {
    if (error.message === 'Tablero no encontrado') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'No tienes permisos para realizar esta acción') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

export async function marcarVariasComoCompletadasHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { tableroId } = req.params;
    const { tareasIds } = req.body;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const resultado = await marcarVariasComoCompletadas(tableroId, usuarioId, tareasIds);
    res.status(200).json(resultado);
  } catch (error: any) {
    if (error.message === 'Tablero no encontrado') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'No tienes permisos para realizar esta acción') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}

export async function obtenerEstadisticasHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { tableroId } = req.params;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const estadisticas = await obtenerEstadisticasTablero(tableroId, usuarioId);
    res.status(200).json({ estadisticas });
  } catch (error: any) {
    if (error.message === 'Tablero no encontrado') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'No tienes permisos para realizar esta acción') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}
