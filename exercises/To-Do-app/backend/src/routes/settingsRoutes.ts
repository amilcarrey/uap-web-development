import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/settings', authMiddleware, getSettings);
router.put('/settings', authMiddleware, updateSettings);

export default router;