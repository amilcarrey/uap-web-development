import { Router } from 'express';
import { me, updateSettings } from '../controllers/user.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const router = Router();

router.get('/me', isAuthenticated, me);
router.patch('/settings', isAuthenticated, updateSettings);

export default router;
