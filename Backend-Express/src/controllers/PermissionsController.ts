import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { assignBoardPermission } from '../services/permissionService';

// Extiende el tipo Request para incluir información del usuario autenticado
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email?: string;
  };
}

/**
 * Asigna un rol a un usuario en un tablero específico.
 * Solo el propietario del tablero puede realizar esta acción.
 */
export const assignPermission = async (req: AuthenticatedRequest, res: Response) => {
  const ownerId = req.user?.userId;
  const boardId = Number(req.params.boardId);
  const { userId, role } = req.body;

  if (!ownerId) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const validRoles: Role[] = ['propietario', 'editor', 'lectura'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  try {
    const boardUser = await assignBoardPermission(
      ownerId,
      boardId,
      userId,
      role as Role  
    );

    console.log(
      `Usuario ${ownerId} asignó el permiso "${role}" al usuario ${userId} en el tablero ${boardId}`
    );

    return res.status(200).json({
      message: 'Permisos asignados correctamente',
      boardUser,
    });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    console.error('Error asignando permisos:', error);
    return res.status(500).json({ message: 'Error asignando permisos' });
  }
};
