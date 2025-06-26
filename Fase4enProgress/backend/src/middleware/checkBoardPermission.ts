import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';

export const checkBoardPermission = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let boardId: string | null = null;

    if (typeof req.query.boardId === "string") {
      boardId = req.query.boardId;
    } else if (typeof req.body.boardId === "string") {
      boardId = req.body.boardId;
    } else if (typeof req.params.id === "string") {
      boardId = req.params.id;
    }

    const userId = req.user?.id;

    if (!boardId || !userId) {
      console.log("DEBUG boardId:", boardId);
      console.log("DEBUG userId:", userId);
      res.status(400).json({ error: 'Faltan datos' });
      return;
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
      return;
    }

    next();
  };
};
