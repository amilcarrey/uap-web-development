import {Router} from 'express';
import { TaskController } from '../controllers/TaskController';
const router = Router();

//Rutas anidadas bajo: /api/boards/:boardId/tasks

router.get('/', TaskController.getTaks);
router.post('/:boardId/tasks', TaskController.createTask);
router.delete('/', TaskController.deleteCompletedTasks);
router.put('/:taskId', TaskController.updateTask);
router.delete('/:taskId', TaskController.deleteTask);

//router.get('/:taskId', TaskController.getTaskById); // <-- Servia para realizar pruebas

export default router;