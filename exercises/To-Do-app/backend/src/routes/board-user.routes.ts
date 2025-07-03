import { Router } from 'express';
import { addUserToBoard, getBoardUsers, updateBoardUserRole, removeUserFromBoard } from '../controllers/board-user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, addUserToBoard);
router.get('/', authMiddleware, getBoardUsers);
router.put('/:userId', authMiddleware, updateBoardUserRole);
router.delete('/:userId', authMiddleware, removeUserFromBoard);

export default router;