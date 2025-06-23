import { Router } from 'express';
import { PermissionController } from '../controllers/PermissionController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/board/:boardId/permission', PermissionController.grantPermission);
router.delete('/board/:boardId/permission/:userId', PermissionController.revokePermission);
router.get('/board/:boardId/permission', PermissionController.getBoardPermissions);
router.put('/board/:boardId/permission/:userId', PermissionController.updatePermission);

export default router;