// src/middlewares/permission.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AccessLevel } from '../enum/access-level.enum';
import { PermissionService } from '../modules/permission/permission.service';
import { PermissionRepository } from '../modules/permission/permission.repository';
import { BoardRepository } from '../modules/board/board.repository';
import { ReminderRepository } from '../modules/reminder/reminder.repository';

const permissionService = new PermissionService(
  new PermissionRepository(),
  new BoardRepository()
);

const reminderRepository = new ReminderRepository();

export const requirePermission = (requiredLevel: AccessLevel) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let board_id = req.params.board_id || req.body.board_id;
      if (!board_id && req.params.id) {
        const reminder = await reminderRepository.getReminderById(req.params.id);
        if (!reminder) {
          return res.status(404).json({ error: 'Reminder no encontrado' });
        }
        board_id = reminder.board_id;
      }
      const user_id = req.user.id; // Asume que el middleware de autenticación añade req.user
      
      if (!board_id) {
        return res.status(400).json({ error: 'Board ID is required' });
      }

      // Usamos la función que implementamos
      const userPermission = await permissionService.getPermissionForUser(user_id, board_id);
      
      // Verificar si el permiso es suficiente
      const hasPermission = permissionService.hasSufficientPermission(
        userPermission, 
        requiredLevel
      );
      
      if (!hasPermission) {
        return res.status(403).json({ 
          error: `Se requiere permiso de ${requiredLevel} para esta acción` 
        });
      }
      
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      
      if (error instanceof Error && error.message === 'Board not found') {
        return res.status(404).json({ error: 'Tablero no encontrado' });
      }
      
      res.status(500).json({ error: 'Error verificando permisos' });
    }
  };
};