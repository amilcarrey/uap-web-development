import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const canEditBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.id;
  let boardId = req.params.boardId;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  // Si no viene boardId por params, intentar inferirlo desde una tarea
  if (!boardId && req.params.taskId) {
    const task = await prisma.task.findUnique({
      where: { id: req.params.taskId },
      select: { boardId: true }
    });

    if (!task?.boardId) {
      res.status(400).json({ error: 'No se pudo determinar el tablero desde la tarea' });
      return;
    }

    boardId = task.boardId;
  }

  try {
    // Verificar si es la dueña del tablero
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { ownerId: true }
    });

    if (board?.ownerId === userId) {
      return next();
    }

    // Verificar si tiene permisos compartidos con rol adecuado
    const sharedBoard = await prisma.sharedBoard.findFirst({
      where: {
        userId,
        boardId,
        role: {
          in: ['OWNER', 'EDITOR']
        }
      }
    });

    if (!sharedBoard) {
      res.status(403).json({ error: 'No tenés permisos para editar este tablero' });
      return;
    }

    next();
  } catch (error) {
    console.error('Error en canEditBoard:', error);
    res.status(500).json({ error: 'Error al verificar permisos de edición' });
  }
};
