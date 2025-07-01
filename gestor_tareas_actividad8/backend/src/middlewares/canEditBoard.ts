import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { MiddlewareFn } from '../types/middleware';

const prisma = new PrismaClient();

export const canEditBoard: MiddlewareFn = async (req, res, next) => {
  const { id: userId } = req.user || {};
  const { boardId } = req.params;

  // Validación de autenticación
  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  try {
    // Verificar permisos de edición
    const sharedBoard = await prisma.sharedBoard.findFirst({
      where: {
        userId,
        boardId,
        role: {
          in: ['OWNER', 'EDITOR'] // Solo OWNER y EDITOR pueden editar
        }
      },
      select: {
        role: true
      }
    });

    if (!sharedBoard) {
      res.status(403).json({ error: 'No tenés permisos para editar este tablero' });
      return;
    }

    // Si todo está bien, continuar
    next();
  } catch (error) {
    console.error('Error en canEditBoard:', error);
    res.status(500).json({ error: 'Error al verificar permisos de edición' });
  }
};