import express from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { checkBoardPermission } from "../middleware/checkBoardPermission";
import { getTasks, createTask } from "../controllers/taskController";

const router = express.Router();

router.use(requireAuth);

// Obtener tareas de un tablero
router.get("/", checkBoardPermission(["owner", "editor", "viewer"]), getTasks);

// Crear nueva tarea
router.post("/", checkBoardPermission(["owner", "editor"]), createTask);

export default router;
