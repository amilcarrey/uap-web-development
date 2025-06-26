import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prismaClient';

export type PermissionLevel = 'propietario' | 'editor' | 'lectura';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

/**
 * Middleware para validar permisos en un tablero según el rol mínimo requerido.
 */
export function checkBoardPermission(minRole: PermissionLevel) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const boardIdStr = req.params.boardId;
      const boardId = parseInt(boardIdStr, 10);

      if (isNaN(boardId)) {
        return res.status(400).json({ error: 'ID de tablero inválido' });
      }

      const board = await prisma.board.findUnique({
        where: { id: boardId },
      });

      if (!board) {
        return res.status(404).json({ error: 'Tablero no encontrado' });
      }

      // Permitir acceso directo al propietario
      if (board.ownerId === userId) {
        return next();
      }

      // Verificar permisos del usuario en el tablero
      const boardUser = await prisma.boardUser.findUnique({
        where: {
          boardId_userId: {
            boardId,
            userId,
          },
        },
      });

      if (!boardUser) {
        return res.status(403).json({ error: 'No tiene permisos para este tablero' });
      }

      const rolesOrder = {
        propietario: 3,
        editor: 2,
        lectura: 1,
      };

      if (rolesOrder[boardUser.role] < rolesOrder[minRole]) {
        return res.status(403).json({ error: 'Permisos insuficientes para realizar esta acción' });
      }

      return next();
    } catch (error) {
      console.error('Error en middleware permisos:', error);
      return res.status(500).json({ error: 'Error interno' });
    }
  };
}
