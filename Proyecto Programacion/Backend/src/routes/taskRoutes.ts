import {Router} from 'express';
import { TaskController } from '../controllers/TaskController';

const router = Router();

router.post('/:userId/:boardId', TaskController.createTask);
router.get('/:userId/:boardId', TaskController.getTaks);
router.get('/:taskId', TaskController.getTaskById);
router.put('/:taskId', TaskController.updateTask);
router.delete('/:taskId', TaskController.deleteTask);

export default router;