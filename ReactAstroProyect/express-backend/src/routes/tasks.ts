import express from "express";
import {
  getTasksHandler,
  addTaskHandler,
  deleteTaskHandler,
  toggleTaskHandler,
  deleteCompletedTasksHandler,
  editTaskHandler,
} from "../controllers/taskController.js";

const router = express.Router();

// Obtener tareas con paginación y filtro
router.get("/", getTasksHandler);

// Agregar una nueva tarea
router.post("/", addTaskHandler);

// Eliminar tareas completadas
router.delete("/completed", deleteCompletedTasksHandler);

// Eliminar una tarea
router.delete("/:id", deleteTaskHandler);

// Alternar el estado de una tarea
router.patch("/:id/toggle", toggleTaskHandler);

// Editar una tarea
router.put("/:id", editTaskHandler); // Ruta para editar una tarea

export default router;