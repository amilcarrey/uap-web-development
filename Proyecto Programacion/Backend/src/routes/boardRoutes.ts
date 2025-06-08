import { Router } from 'express';
import { BoardController } from '../controllers/boardController';

const router = Router();

router.post('/', BoardController.createBoard);

export default router;