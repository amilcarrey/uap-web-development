import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const canEditBoard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.id;
  const boardId = req.params.boardId;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  try {
    // ✅ Primero verificar si es la dueña del tablero
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { ownerId: true }
    });

    if (board?.ownerId === userId) {
      return next(); // Tiene acceso por ser la dueña
    }

    // 🔁 Si no es la dueña, verificar permisos compartidos
    const sharedBoard = await prisma.sharedBoard.findFirst({
      where: {
        userId,
        boardId,
        role: {
          in: ['OWNER', 'EDITOR'] // Permisos que permiten edición
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
