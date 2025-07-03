import { Router } from 'express';
import { createBoard, getBoards, getBoardById, updateBoard, deleteBoard } from '../controllers/board.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createBoard);
router.get('/', authMiddleware, getBoards);
router.get('/:id', authMiddleware, getBoardById);
router.put('/:id', authMiddleware, updateBoard);
router.delete('/:id', authMiddleware, deleteBoard);

export default router;