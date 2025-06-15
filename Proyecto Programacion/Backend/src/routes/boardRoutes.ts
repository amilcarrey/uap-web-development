import { Router } from 'express';
import { BoardController } from '../controllers/BoardController'; // Corrige el casing del import

const router = Router();

router.post('/', BoardController.createBoard);

export default router;