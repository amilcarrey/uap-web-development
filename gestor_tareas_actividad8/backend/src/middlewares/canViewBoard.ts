import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const canViewBoard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.id;
  const boardId = req.params.boardId;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  try {
    // ✅ Primero verificar si el usuario es dueño
    const board = await prisma.board.findUnique({
      where: { id: boardId }
    });

    if (board?.ownerId === userId) {
      return next();
    }

    // 🔁 Si no, buscar en SharedBoard
    const shared = await prisma.sharedBoard.findFirst({
      where: { userId, boardId }
    });

    if (!shared) {
      res.status(403).json({ error: 'No tenés acceso a este tablero' });
      return;
    }

    next();
  } catch (error) {
    console.error('Error en canViewBoard:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
