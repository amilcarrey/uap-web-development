import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const isOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.id;
  const boardId = req.params.boardId?.trim();

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  if (!boardId) {
    res.status(400).json({ error: 'ID del tablero no especificado' });
    return;
  }

  try {
    const board = await prisma.board.findUnique({ where: { id: boardId } });

    if (board?.ownerId === userId) {
      next();
      return;
    }

    const shared = await prisma.sharedBoard.findFirst({
      where: {
        boardId,
        userId,
        role: 'OWNER'
      }
    });

    if (shared) {
      next();
    } else {
      res.status(403).json({ error: 'Solo el propietario puede realizar esta acción' });
    }
  } catch (error) {
    console.error('Error en isOwner:', error);
    res.status(500).json({ error: 'Error al verificar propiedad del tablero' });
  }
};
