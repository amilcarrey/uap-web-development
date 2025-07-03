import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquema de validación para crear un tablero
const createBoardSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
});

// Esquema de validación para editar un tablero
const updateBoardSchema = z.object({
  title: z.string().min(1, 'El título es requerido').optional(),
  description: z.string().optional(),
});

// Listar tableros
export const getBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const boards = await prisma.board.findMany({
      where: { ownerId: userId },
      include: { tasks: true }, // Incluye tareas asociadas
    });

    res.status(200).json({ boards, message: boards.length ? 'Tableros encontrados' : 'No hay tableros disponibles' });
  } catch (error) {
    console.error('Error al obtener tableros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un tablero
export const createBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const { title, description } = createBoardSchema.parse(req.body);

    const board = await prisma.board.create({
      data: {
        title,
        description,
        ownerId: userId,
      },
    });

    // Asignar permiso de "owner" al creador del tablero
    await prisma.permission.create({
      data: {
        userId,
        boardId: board.id,
        role: 'owner',
      },
    });

    res.status(201).json({ board, message: 'Tablero creado exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error al crear tablero:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

// Editar un tablero
export const updateBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const boardId = parseInt(req.params.id);
    const { title, description } = updateBoardSchema.parse(req.body);

    // Verificar que el usuario sea el propietario
    const permission = await prisma.permission.findFirst({
      where: { boardId, userId, role: 'owner' },
    });
    if (!permission) {
      res.status(403).json({ error: 'No autorizado: solo el propietario puede editar el tablero' });
      return;
    }

    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: { title, description },
    });

    res.status(200).json({ board: updatedBoard, message: 'Tablero actualizado exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error al actualizar tablero:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

// Eliminar un tablero
export const deleteBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const boardId = parseInt(req.params.id);

    // Verificar que el usuario sea el propietario
    const permission = await prisma.permission.findFirst({
      where: { boardId, userId, role: 'owner' },
    });
    if (!permission) {
      res.status(403).json({ error: 'No autorizado: solo el propietario puede eliminar el tablero' });
      return;
    }

    await prisma.board.delete({
      where: { id: boardId },
    });

    res.status(200).json({ message: 'Tablero eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar tablero:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};