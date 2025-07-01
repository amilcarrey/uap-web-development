import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { MiddlewareFn } from '../types/middleware';

const prisma = new PrismaClient();

export const isOwner: MiddlewareFn = async (req, res, next) => {
  const { id: userId } = req.user || {};
  const { boardId } = req.params;

  // Validación de autenticación
  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  try {
    // Verificar si es propietario
    const isBoardOwner = await prisma.board.findFirst({
      where: {
        id: boardId,
        ownerId: userId
      },
      select: {
        id: true
      }
    });

    // Alternativa: Verificación a través de SharedBoard
    const sharedAccess = await prisma.sharedBoard.findFirst({
      where: {
        userId,
        boardId,
        role: 'OWNER'
      }
    });

    if (!isBoardOwner && !sharedAccess) {
      res.status(403).json({ error: 'Solo el propietario puede realizar esta acción' });
      return;
    }

    // Si todo está bien, continuar
    next();
  } catch (error) {
    console.error('Error en isOwner:', error);
    res.status(500).json({ error: 'Error al verificar propiedad del tablero' });
  }
};