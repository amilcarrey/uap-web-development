import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquema de validación para crear una tarea
const createTaskSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  boardId: z.number().int().positive('El ID del tablero debe ser un número positivo'),
});

// Esquema de validación para editar una tarea
const updateTaskSchema = z.object({
  title: z.string().min(1, 'El título es requerido').optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
});

// Crear una tarea
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const { title, description, boardId } = createTaskSchema.parse(req.body);

    // Verificar que el usuario tenga acceso al tablero (owner o editor)
    const permission = await prisma.permission.findFirst({
      where: { boardId, userId, role: { in: ['owner', 'editor'] } },
    });
    if (!permission) {
      res.status(403).json({ error: 'No autorizado: no tienes permisos para este tablero' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        boardId,
        status: 'pending',
      },
    });

    res.status(201).json({ task, message: 'Tarea creada exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error al crear tarea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

// Listar tareas de un tablero
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const boardId = parseInt(req.params.boardId);

    // Verificar que el usuario tenga acceso al tablero (cualquier rol)
    const permission = await prisma.permission.findFirst({
      where: { boardId, userId },
    });
    if (!permission) {
      res.status(403).json({ error: 'No autorizado: no tienes permisos para este tablero' });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { boardId },
    });

    res.status(200).json({ tasks, message: tasks.length ? 'Tareas encontradas' : 'No hay tareas disponibles' });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Editar una tarea
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const taskId = parseInt(req.params.id);

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    // Verificar que el usuario tenga acceso al tablero (owner o editor)
    const permission = await prisma.permission.findFirst({
      where: { boardId: task.boardId, userId, role: { in: ['owner', 'editor'] } },
    });
    if (!permission) {
      res.status(403).json({ error: 'No autorizado: no tienes permisos para este tablero' });
      return;
    }

    const { title, description, status } = updateTaskSchema.parse(req.body);

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { title, description, status },
    });

    res.status(200).json({ task: updatedTask, message: 'Tarea actualizada exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error al actualizar tarea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

// Completar una tarea
export const completeTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const taskId = parseInt(req.params.id);

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    // Verificar que el usuario tenga acceso al tablero (owner o editor)
    const permission = await prisma.permission.findFirst({
      where: { boardId: task.boardId, userId, role: { in: ['owner', 'editor'] } },
    });
    if (!permission) {
      res.status(403).json({ error: 'No autorizado: no tienes permisos para este tablero' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: 'completed' },
    });

    res.status(200).json({ task: updatedTask, message: 'Tarea marcada como completada' });
  } catch (error) {
    console.error('Error al completar tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar una tarea
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const taskId = parseInt(req.params.id);

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    // Verificar que el usuario tenga acceso al tablero (owner o editor)
    const permission = await prisma.permission.findFirst({
      where: { boardId: task.boardId, userId, role: { in: ['owner', 'editor'] } },
    });
    if (!permission) {
      res.status(403).json({ error: 'No autorizado: no tienes permisos para este tablero' });
      return;
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.status(200).json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};