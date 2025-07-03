import { Router } from 'express';
import { getBoards } from '../controllers/boardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/boards', authMiddleware, getBoards);

export default router;