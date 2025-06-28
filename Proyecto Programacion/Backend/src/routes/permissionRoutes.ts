import { Router } from 'express';
import { PermissionController } from '../controllers/PermissionController';


// Rutas anidadas bajo: /api/boards/:boardId/permissions

const router = Router({ mergeParams: true });

router.get('/', PermissionController.getBoardPermissions);
router.post('/', PermissionController.grantPermission);
router.put('/:userId', PermissionController.updatePermission);
router.delete('/:userId', PermissionController.revokePermission);

export default router;