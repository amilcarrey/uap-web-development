import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { MiddlewareFn } from '../types/middleware';

const prisma = new PrismaClient();

export const canViewBoard: MiddlewareFn = async (req, res, next) => {
  const userId = req.user?.id;
  const boardId = req.params.boardId;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  try {
    const shared = await prisma.sharedBoard.findFirst({
      where: { userId, boardId },
    });

    if (!shared) {
      res.status(403).json({ error: 'No tenés acceso a este tablero' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};