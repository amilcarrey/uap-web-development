import { Router } from "express";
import { TaskRepository } from "../modules/task/task.repository";
import { TaskService } from "../modules/task/task.service";
import { TaskController } from "../modules/task/task.controller";
import { canModifyTasks } from "../middleware/permissions.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);
const taskPermissions = canModifyTasks(taskService);

router.get("/:boardId",authMiddleware, taskController.getAllTasks);
router.post("/:boardId", authMiddleware,  taskPermissions, taskController.createTask);
router.delete("/:taskId", authMiddleware,  taskPermissions, taskController.deleteTask);
router.patch("/:taskId/complete", authMiddleware, taskPermissions,  taskController.completeTask);
router.patch("/:taskId", authMiddleware, taskPermissions, taskController.updateTask);
router.delete("/:boardId/clear-completed", authMiddleware, taskPermissions,  taskController.clearCompleted);


export default router;

