import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/users.controller';

const router = Router();

/**
 * Registro de usuario.
 * Método: POST /register
 */
router.post('/register', registerUser);

/**
 * Login de usuario.
 * Método: POST /login
 */
router.post('/login', loginUser);


export default router;
