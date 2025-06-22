import { Router } from 'express';
import { PermissionController } from '../controllers/PermissionController';
import { authMiddleware } from '../middlewares/authMiddleware';


const router = Router();

router.post('/board/:boardId/permission', authMiddleware ,PermissionController.grantPermission);
router.delete('/board/:boardId/permission/:userId', authMiddleware ,PermissionController.revokePermission);
router.get('/board/:boardId/permission', authMiddleware ,PermissionController.getBoardPermissions);
router.put('/board/:boardId/permission/:userId', authMiddleware ,PermissionController.updatePermission);

export default router;