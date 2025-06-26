import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { assignPermission } from '../controllers/PermissionsController';
import { checkBoardPermission } from '../middlewares/checkpermissions.middleware';

const router = express.Router();

/**
 * Ruta para asignar permisos en un tablero.
 * Requiere que el usuario esté autenticado y sea propietario del tablero.
 * Método: POST /tablero/:boardId/permisos
 */
router.post(
  '/tablero/:boardId/permisos',
  authenticateToken,
  checkBoardPermission('propietario'),
  assignPermission
);

export default router;
