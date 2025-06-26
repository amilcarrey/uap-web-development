// src/middleware/checkBoardPermission.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';

export const checkBoardPermission = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const boardId = req.params.id;
    const userId = req.user?.id;

    if (!boardId || !userId) {
      res.status(400).json({ error: 'Faltan datos' });
      return; //necesario para que la función devuelva void
    }

    const permission = await prisma.boardPermission.findFirst({
      where: {
        boardId,
        userId,
        role: { in: roles },
      },
    });

    if (!permission) {
      res.status(403).json({ error: 'No tenés permiso para esta acción' });
      return; // 
    }

    next(); //
  };
};
