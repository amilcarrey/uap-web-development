import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteCompletedTasks,
} from "../controllers/tasks.controller";

const router = Router();

// Importante: ruta DELETE para completadas va antes que la ruta con :taskId
router.get("/", getTasks); // Listar tareas
router.post("/", createTask); // Crear tarea
router.put("/:taskId", updateTask); // Actualizar tarea
router.delete("/completed", deleteCompletedTasks); // Eliminar tareas completadas (query: boardId)
router.delete("/:taskId", deleteTask); // Eliminar tarea

export default router;
