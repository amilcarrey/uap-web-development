import express from "express";
import {
  getTasksHandler,
  addTaskHandler,
  deleteTaskHandler,
  toggleTaskHandler,
  deleteCompletedTasksHandler,
  editTaskHandler,
} from "../controllers/taskController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Obtener tareas con paginación y filtro
router.get("/", authMiddleware, getTasksHandler);

// Agregar una nueva tarea
router.post("/", authMiddleware, addTaskHandler);

// Eliminar tareas completadas
router.delete("/completed", authMiddleware, deleteCompletedTasksHandler);

// Eliminar una tarea
router.delete("/:id", authMiddleware,deleteTaskHandler);

// Alternar el estado de una tarea
router.patch("/:id/toggle", authMiddleware,toggleTaskHandler);

// Editar una tarea
router.put("/:id",authMiddleware,  editTaskHandler); 

export default router;