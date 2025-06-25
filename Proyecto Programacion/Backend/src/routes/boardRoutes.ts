import { Router } from 'express';
import { BoardController } from '../controllers/BoardController';

const router = Router();

// Rutas anidadas bajo: /api/boards
router.use((req, res, next) => {
    console.log('Board routes middleware executed');
    next();
});
router.get('/', BoardController.getBoards); // Obtiene todos los tableros del usuario autenticado
router.post('/', BoardController.createBoard);
router.put('/:boardId', BoardController.updateBoard);
router.delete('/:userId/:boardId', BoardController.deleteBoard);

//router.get('/:boardId', BoardController.getBoardById); // <-- Servia para realizar pruebas
//router.get('/user/:userId', BoardController.getBoardsByuser); // <-- Servia para realizar pruebas

export default router;