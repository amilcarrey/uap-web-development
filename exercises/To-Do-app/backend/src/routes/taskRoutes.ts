import { Router } from 'express';
import { createTask, getTasks, updateTask, completeTask, deleteTask } from '../controllers/taskController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createTask);
router.get('/board/:boardId', authMiddleware, getTasks);
router.put('/:id', authMiddleware, updateTask);
router.patch('/:id/complete', authMiddleware, completeTask);
router.delete('/:id', authMiddleware, deleteTask);

export default router;