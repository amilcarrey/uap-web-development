import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';

// Definir un tipo local para los roles
type Role = 'owner' | 'editor' | 'viewer';

// Esquema de validación para crear un tablero
const createBoardSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
});

// Esquema de validación para actualizar un tablero
const updateBoardSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').optional(),
  description: z.string().optional(),
});

// Crear un tablero
export const createBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = createBoardSchema.parse(req.body);
    const userId = (req as any).user.id; // Obtenido desde authMiddleware

    const board = await prisma.board.create({
      data: {
        title,
        description,
        users: {
          create: [{ userId, role: 'owner' }],
        },
      },
    });

    res.status(201).json({ message: 'Tablero creado', board });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Error al crear el tablero' });
  }
};

// Listar tableros del usuario autenticado
export const getBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const boards = await prisma.board.findMany({
      where: {
        users: {
          some: { userId },
        },
      },
    });

    res.json({ message: 'Lista de tableros', boards });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tableros' });
  }
};

// Obtener un tablero por ID
export const getBoardById = async (req: Request, res: Response): Promise<void> => {
  try {
    const boardId = parseInt(req.params.id);
    const userId = (req as any).user.id;

    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        users: {
          some: { userId },
        },
      },
      include: {
        tasks: true,
        users: { include: { user: true } },
      },
    });

    if (!board) {
      res.status(404).json({ error: 'Tablero no encontrado o no tienes acceso' });
      return;
    }

    res.json({ message: 'Tablero encontrado', board });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el tablero' });
  }
};

// Actualizar un tablero
export const updateBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const boardId = parseInt(req.params.id);
    const userId = (req as any).user.id;
    const { title, description } = updateBoardSchema.parse(req.body);

    const boardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId, boardId },
      },
    });

    if (!boardUser || boardUser.role !== 'owner') {
      res.status(403).json({ error: 'No tienes permiso para actualizar este tablero' });
      return;
    }

    const board = await prisma.board.update({
      where: { id: boardId },
      data: { title, description },
    });

    res.json({ message: 'Tablero actualizado', board });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Error al actualizar el tablero' });
  }
};

// Eliminar un tablero
export const deleteBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const boardId = parseInt(req.params.id);
    const userId = (req as any).user.id;

    const boardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId, boardId },
      },
    });

    if (!boardUser || boardUser.role !== 'owner') {
      res.status(403).json({ error: 'No tienes permiso para eliminar este tablero' });
      return;
    }

    await prisma.board.delete({ where: { id: boardId } });

    res.json({ message: 'Tablero eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el tablero' });
  }
};