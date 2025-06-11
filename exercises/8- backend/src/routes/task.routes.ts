import { Router } from "express";
import { TaskController } from "../modules/task/task.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  validateTaskCreation,
  validateTaskUpdate,
  validateRequest,
} from "../middleware/validation.middleware";

const router = Router();
const taskController = new TaskController();

// All task routes require authentication
router.use(authenticateToken);

// Task operations for a specific board
router.get("/board/:boardId", taskController.getTasks.bind(taskController));
router.post(
  "/board/:boardId",
  validateTaskCreation,
  validateRequest,
  taskController.createTask.bind(taskController)
);
router.get(
  "/board/:boardId/counts",
  taskController.getTaskCounts.bind(taskController)
);
router.post(
  "/board/:boardId/clear-completed",
  taskController.clearCompleted.bind(taskController)
);

// Individual task operations
router.get("/:id", taskController.getTask.bind(taskController));
router.put(
  "/:id",
  validateTaskUpdate,
  validateRequest,
  taskController.updateTask.bind(taskController)
);
router.delete("/:id", taskController.deleteTask.bind(taskController));

export default router;
