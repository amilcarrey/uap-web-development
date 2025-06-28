import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Rutas principales de usuario
router.get('/', authMiddleware, UserController.getAllUsers); // Obtener todos los usuarios
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, UserController.updateProfile);
router.get('/search', authMiddleware, UserController.searchUsers);

/* NO SE USAN, SOLO SON PARA PRUEBAS*/
router.post('/register', UserController.register); // <-- Servia para realizar pruebas
// router.get('/', UserController.getAll); // <-- Comentado para evitar conflictos
// router.get('/', UserController.getUsers); // <-- Comentado para evitar conflictos

export default router;