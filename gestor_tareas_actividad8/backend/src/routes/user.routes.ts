import { Router } from 'express';
import { me } from '../controllers/user.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { updateSettings } from '../controllers/user.controller';

const router = Router();

router.get('/me', isAuthenticated, me);
router.patch('/settings', isAuthenticated, updateSettings);

export default router;
