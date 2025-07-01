import { Router, Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { canViewBoard } from '../middlewares/canViewBoard';
import { canEditBoard } from '../middlewares/canEditBoard';


const prisma = new PrismaClient();
const router = Router();

// 📋 Ver tareas de un tablero
router.get('/boards/:boardId/tasks', isAuthenticated, canViewBoard, async (req: Request, res: Response) => {
  const { boardId } = req.params;
  const { search, page = 1 } = req.query;

  const take = 10;
  const skip = (Number(page) - 1) * take;

  const where = {
    boardId,
    ...(search ? { text: { contains: String(search), mode: Prisma.QueryMode.insensitive } } : {})
  };

  try {
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// ➕ Agregar tarea a un tablero
router.post('/boards/:boardId/tasks', isAuthenticated, canEditBoard, async (req: Request, res: Response) => {
  const { boardId } = req.params;
  const { text } = req.body;

  try {
    const nueva = await prisma.task.create({
      data: {
        text,
        boardId
      }
    });

    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

// ✏️ Editar tarea
router.patch('/tasks/:taskId', isAuthenticated, async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { text, completed } = req.body;

  try {
    const actualizada = await prisma.task.update({
      where: { id: taskId },
      data: { text, completed }
    });

    res.json(actualizada);
  } catch (error) {
    console.error('Error al editar tarea:', error);
    res.status(500).json({ error: 'Error al editar la tarea' });
  }
});

// 🗑️ Eliminar tarea
router.delete('/tasks/:taskId', isAuthenticated, async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

// 🗑️ Eliminar todas las completadas de un board
router.delete('/boards/:boardId/tasks/completed', isAuthenticated, canEditBoard, async (req: Request, res: Response) => {
  const { boardId } = req.params;

  try {
    const result = await prisma.task.deleteMany({
      where: {
        boardId,
        completed: true
      }
    });

    res.json({ message: `Se eliminaron ${result.count} tareas completadas` });
  } catch (error) {
    console.error('Error al eliminar tareas completadas:', error);
    res.status(500).json({ error: 'Error al eliminar tareas completadas' });
  }
});

export default router;
