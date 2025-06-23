import {Router} from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/:userId/:boardId', TaskController.createTask);
router.get('/:userId/:boardId', TaskController.getTaks);
router.get('/:taskId', TaskController.getTaskById);
router.put('/:taskId', TaskController.updateTask);
router.delete('/:taskId', TaskController.deleteTask);
router.delete('/completed/:userId/:boardId', TaskController.deleteCompletedTasks);

export default router;