import { Router } from 'express';
import { AuthController } from '../modules/auth/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);  
// En auth.route.ts
router.get("/me", authMiddleware, AuthController.me); // ✅ protegida

router.post('/logout', AuthController.logout);


export default router;