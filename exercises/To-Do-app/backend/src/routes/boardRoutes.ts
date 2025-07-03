import { Router } from 'express';
import { getBoards, createBoard, updateBoard, deleteBoard } from '../controllers/boardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getBoards);
router.post('/', authMiddleware, createBoard);
router.put('/:id', authMiddleware, updateBoard);
router.delete('/:id', authMiddleware, deleteBoard);

export default router;