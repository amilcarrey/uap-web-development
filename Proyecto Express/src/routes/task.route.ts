import { Router } from "express";
import { TaskRepository } from "../modules/task/task.repository";
import { TaskService } from "../modules/task/task.service";
import { TaskController } from "../modules/task/task.controller";
import { authWithCookiesMiddleware } from "../middleware/auth.middleware";

const router = Router();
const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

router.use(authWithCookiesMiddleware);

router.delete("/clear-completed", taskController.clearCompleted);

router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.delete("/:id", taskController.deleteTask);
router.patch("/:id", taskController.updateTask); //patch es para actualizar o modificar parcialmente
router.patch("/:id/toggle", taskController.toggleTask);


export { router as taskRoutes };