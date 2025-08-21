import {Router} from 'express';
import { TaskController } from '../controllers/TaskController';

const router = Router({ mergeParams: true });

router.get('/', TaskController.getTaks);
router.post('/', TaskController.createTask);
router.delete('/', TaskController.deleteCompletedTasks);
router.put('/:taskId', TaskController.updateTask);
router.delete('/:taskId', TaskController.deleteTask);

export default router;