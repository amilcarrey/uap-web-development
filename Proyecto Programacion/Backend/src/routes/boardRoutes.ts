import { NextFunction, Router } from 'express';
import { BoardController } from '../controllers/BoardController';
import taskRoutes from './taskRoutes';
import permissionRoutes from './permissionRoutes';

const router = Router();

function getCurrentBoardId(req: any, _: any, next: NextFunction) {
    const boardId = req.params.boardId;
    //console.log(`Current board ID: ${boardId}`);

    req.boardId = boardId ? Number(boardId) : null;
    next()
}

// Rutas anidadas bajo: /api/boards
/*
router.use((req, res, next) => {
    console.log('Board routes middleware executed'); 
    next();
});
*/

router.get('/', BoardController.getBoards); // Obtiene todos los tableros del usuario autenticado
router.post('/', BoardController.createBoard);
router.put('/:boardId', BoardController.updateBoard);
router.delete('/:boardId', BoardController.deleteBoard);

// Montar las rutas de tareas como subrutas
router.use('/:boardId/tasks', getCurrentBoardId, taskRoutes);

//Monto las rutas de permisos como subrutas
router.use('/:boardId/permissions', getCurrentBoardId, permissionRoutes)
//router.get('/:boardId', BoardController.getBoardById); // <-- Servia para realizar pruebas
//router.get('/user/:userId', BoardController.getBoardsByuser); // <-- Servia para realizar pruebas

export default router;