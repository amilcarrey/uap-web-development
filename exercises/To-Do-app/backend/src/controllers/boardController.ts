import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId; // Ahora debería ser reconocido gracias a express.d.ts
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const boards = await prisma.board.findMany({
      where: { ownerId: userId },
    });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tableros' });
  }
};