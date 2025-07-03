import { Router } from 'express';
import { PermissionController } from '../controllers/PermissionController';

const router = Router({ mergeParams: true });

router.get('/', PermissionController.getBoardPermissions);
router.post('/', PermissionController.grantPermission);
router.put('/:userId', PermissionController.updatePermission);
router.delete('/:userId', PermissionController.revokePermission); 
router.delete('/by-id/:permissionId', PermissionController.revokePermissionById); 

export default router;
