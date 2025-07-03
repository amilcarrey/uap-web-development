import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';

// Definir un tipo local para los roles
type Role = 'owner' | 'editor' | 'viewer';

// Esquema de validación para crear una tarea
const createTaskSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'done']).default('pending'),
  boardId: z.number().int().positive('El ID del tablero debe ser un número positivo'),
});

// Esquema de validación para actualizar una tarea
const updateTaskSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'done']).optional(),
});

// Crear una tarea
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, status, boardId } = createTaskSchema.parse(req.body);
    const userId = (req as any).user.id;

    // Verificar si el usuario tiene acceso al tablero y es owner o editor
    const boardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId, boardId },
      },
    });

    if (!boardUser || boardUser.role === 'viewer') {
      res.status(403).json({ error: 'No tienes permiso para crear tareas en este tablero' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        boardId,
      },
    });

    res.status(201).json({ message: 'Tarea creada', task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

// Listar tareas de un tablero
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const boardId = parseInt(req.params.boardId);
    const userId = (req as any).user.id;

    // Verificar si el usuario tiene acceso al tablero
    const boardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId, boardId },
      },
    });

    if (!boardUser) {
      res.status(403).json({ error: 'No tienes acceso a este tablero' });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { boardId },
    });

    res.json({ message: 'Lista de tareas', tasks });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};

// Obtener una tarea por ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id);
    const boardId = parseInt(req.params.boardId);
    const userId = (req as any).user.id;

    // Verificar si el usuario tiene acceso al tablero
    const boardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId, boardId },
      },
    });

    if (!boardUser) {
      res.status(403).json({ error: 'No tienes acceso a este tablero' });
      return;
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.boardId !== boardId) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    res.json({ message: 'Tarea encontrada', task });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tarea' });
  }
};

// Actualizar una tarea
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id);
    const boardId = parseInt(req.params.boardId);
    const userId = (req as any).user.id;
    const { title, description, status } = updateTaskSchema.parse(req.body);

    // Verificar si el usuario tiene acceso al tablero y es owner o editor
    const boardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId, boardId },
      },
    });

    if (!boardUser || boardUser.role === 'viewer') {
      res.status(403).json({ error: 'No tienes permiso para actualizar tareas en este tablero' });
      return;
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.boardId !== boardId) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { title, description, status },
    });

    res.json({ message: 'Tarea actualizada', task: updatedTask });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};

// Eliminar una tarea
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id);
    const boardId = parseInt(req.params.boardId);
    const userId = (req as any).user.id;

    // Verificar si el usuario tiene acceso al tablero y es owner o editor
    const boardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId, boardId },
      },
    });

    if (!boardUser || boardUser.role === 'viewer') {
      res.status(403).json({ error: 'No tienes permiso para eliminar tareas en este tablero' });
      return;
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.boardId !== boardId) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    await prisma.task.delete({ where: { id: taskId } });

    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};