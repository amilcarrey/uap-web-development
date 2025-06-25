import { Router } from 'express';
import { PermissionController } from '../controllers/PermissionController';
const router = Router();

// Rutas anidadas bajo: /api/boards/:boardId/permissions

router.get('/', PermissionController.getBoardPermissions);
router.post('/', PermissionController.grantPermission);
router.put('/:permissionId', PermissionController.updatePermission);
router.delete('/:permissionId"', PermissionController.revokePermission);

export default router;