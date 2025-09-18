import { NextFunction, Router } from 'express';
import { BoardController } from '../controllers/BoardController';
import taskRoutes from './taskRoutes';
import permissionRoutes from './permissionRoutes';

const router = Router();

function getCurrentBoardId(req: any, _: any, next: NextFunction) {
    const boardId = req.params.boardId;
    

    req.boardId = boardId ? Number(boardId) : null;
    next()
}

router.get('/', BoardController.getBoards); 
router.post('/', BoardController.createBoard);
router.put('/:boardId', BoardController.updateBoard);
router.delete('/:boardId', BoardController.deleteBoard);

router.use('/:boardId/tasks', getCurrentBoardId, taskRoutes);

router.use('/:boardId/permissions', getCurrentBoardId, permissionRoutes)

export default router;
