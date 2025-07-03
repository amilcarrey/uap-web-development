import { Router } from 'express';
import { createPermission, getPermissions, deletePermission } from '../controllers/permissionController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/boards/:id/permissions', authMiddleware, createPermission);
router.get('/boards/:id/permissions', authMiddleware, getPermissions);
router.delete('/boards/:id/permissions/:userId', authMiddleware, deletePermission);

export default router;