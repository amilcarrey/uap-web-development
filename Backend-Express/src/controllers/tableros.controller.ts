import { Request, Response } from 'express';
import {
  agregarTableroService,
  eliminarTableroService,
  obtenerTablerosService,
  obtenerTableroService
} from '../services/tablerosService';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
  };
}

export const crearTablero = async (req: AuthenticatedRequest, res: Response) => {
  const { nombre } = req.body;
  const userId = req.user?.userId;

  if (!nombre || !userId) {
    return res.status(400).json({ error: 'Nombre y usuario requeridos' });
  }

  try {
    const nuevoTablero = await agregarTableroService(nombre.trim(), userId);
    return res.status(201).json({ board: nuevoTablero });
  } catch (error) {
    console.error('Error al crear tablero:', error);
    return res.status(500).json({ error: 'Error interno al crear tablero' });
  }
};

export const borrarTablero = async (req: AuthenticatedRequest, res: Response) => {
  const boardIdStr = req.params.boardId;
  const userId = req.user?.userId;

  if (!boardIdStr || !userId) {
    return res.status(400).json({ error: 'ID y usuario requeridos' });
  }

  const boardId = parseInt(boardIdStr, 10);
  if (isNaN(boardId)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const eliminado = await eliminarTableroService(boardId, userId);

    if (!eliminado) {
      return res.status(404).json({ error: 'Tablero no encontrado o sin permiso' });
    }

    return res.status(200).json({ message: 'Tablero eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar tablero:', error);
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

export const obtenerTodosLosTableros = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  try {
    const tableros = await obtenerTablerosService(userId);
    return res.status(200).json(tableros);
  } catch (error) {
    console.error('Error al obtener tableros:', error);
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

export const obtenerTableroPorId = async (req: AuthenticatedRequest, res: Response) => {
  const boardIdStr = req.params.boardId;
  const userId = req.user?.userId;

  if (!boardIdStr || !userId) {
    return res.status(400).json({ error: 'ID y usuario requeridos' });
  }

  const boardId = parseInt(boardIdStr, 10);
  if (isNaN(boardId)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const tablero = await obtenerTableroService(boardId, userId);

    if (!tablero) {
      return res.status(404).json({ error: 'Tablero no encontrado o sin permiso' });
    }

    return res.status(200).json({ board: tablero });
  } catch (error) {
    console.error('Error al obtener tablero:', error);
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};
