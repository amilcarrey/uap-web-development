import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

/* NO SE USAN, SOLO SON PARA PRUEBAS*/

router.post('/register', UserController.register); // <-- Servia para realizar pruebas
router.get('/', UserController.getAll); // <-- Servia para realizar pruebas
router.get('/', UserController.getUsers); // <-- Servia para realizar pruebas

export default router; 
 