import { Router } from 'express';
import { BoardController } from '../controllers/BoardController'; // Corrige el casing del import

const router = Router();

router.post('/', BoardController.createBoard);
router.get('/user/:userId', BoardController.getBoardsByuser);
router.get('/:boardId', BoardController.getBoardById);

export default router;