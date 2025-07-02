import { Router, Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { canViewBoard } from '../middlewares/canViewBoard';
import { canEditBoard } from '../middlewares/canEditBoard';
import { validate } from '../middlewares/validate';
import { createTaskSchema, updateTaskSchema, taskIdParamSchema,boardIdParamSchema } from '../schemas/task.schema';

const prisma = new PrismaClient();
const router = Router();

// Obtener tareas con paginación y búsqueda
router.get('/boards/:boardId/tasks', isAuthenticated,  validate(boardIdParamSchema, 'params'), canViewBoard, async (req: Request, res: Response): Promise<void> => {
  const { boardId } = req.params;
  const { search, page = 1 } = req.query;

  const take = 10;
  const skip = (Number(page) - 1) * take;

  const where = {
    boardId,
    ...(search
      ? {
          text: {
            contains: String(search).trim(),
            mode: Prisma.QueryMode.insensitive
          }
        }
      : {})
  };

  try {
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take
    });

    const total = await prisma.task.count({ where });

    res.json({ tasks, total });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Crear nueva tarea (con validación)
router.post(
  '/boards/:boardId/tasks',
  isAuthenticated,
  validate(boardIdParamSchema, 'params'),
  canEditBoard,
  validate(createTaskSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { boardId } = req.params;
    const { text } = req.body;

    try {
      const nueva = await prisma.task.create({ data: { text, boardId } });
      res.status(201).json(nueva);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      res.status(500).json({ error: 'Error al crear la tarea' });
    }
  }
);

// Editar tarea existente (con validación)
router.patch(
  '/tasks/:taskId',
  isAuthenticated,
  validate(updateTaskSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.params;
    const { text, completed } = req.body;

    try {
      const actualizada = await prisma.task.update({
        where: { id: taskId },
        data: { text, completed },
      });

      res.json(actualizada);
    } catch (error) {
      console.error('Error al editar tarea:', error);
      res.status(500).json({ error: 'Error al editar la tarea' });
    }
  }
);

// Eliminar tarea individual
router.delete
('/tasks/:taskId',
  isAuthenticated,
  validate(taskIdParamSchema, 'params'),
  async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;

  try {
    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

// Toggle de completado
router.patch
('/tasks/:taskId/toggle',
  isAuthenticated,
  validate(taskIdParamSchema, 'params'),
  async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;

  try {
    const tarea = await prisma.task.findUnique({ where: { id: taskId } });

    if (!tarea) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    const actualizada = await prisma.task.update({
      where: { id: taskId },
      data: { completed: !tarea.completed }
    });

    res.json(actualizada);
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
});

// Eliminar todas las tareas completadas de un tablero
router.delete
('/boards/:boardId/tasks/completed',
  isAuthenticated,
  validate(boardIdParamSchema, 'params'),
  canEditBoard,
  async (req: Request, res: Response): Promise<void> => {
  const { boardId } = req.params;

  try {
    const result = await prisma.task.deleteMany({ where: { boardId, completed: true } });
    res.json({ message: `Se eliminaron ${result.count} tareas completadas` });
  } catch (error) {
    console.error('Error al eliminar tareas completadas:', error);
    res.status(500).json({ error: 'Error al eliminar tareas completadas' });
  }
});

export default router;
