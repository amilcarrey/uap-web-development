
import express, { RequestHandler } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { checkBoardPermission } from "../middleware/checkBoardPermission";
import { deleteCompletedTasks } from '../controllers/taskController';

import {
  getTasks,
  createTask,
  getAllTasks,
  toggleTaskCompletion,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
const router = express.Router();

router.use(requireAuth);

const safeGetAllTasks: RequestHandler = async (req, res, next) => {
  try {
    await getAllTasks(req, res);
  } catch (err) {
    console.error("Error en getAllTasks:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

router.get("/all", checkBoardPermission(["owner", "editor", "viewer"]), safeGetAllTasks);
router.get("/", checkBoardPermission(["owner", "editor", "viewer"]), getTasks);
router.post("/", checkBoardPermission(["owner", "editor"]), createTask);

router.patch("/:id/toggle", checkBoardPermission(["owner", "editor"]), toggleTaskCompletion);
router.put("/:id", checkBoardPermission(["owner", "editor"]), updateTask);
router.delete("/:id", checkBoardPermission(["owner", "editor"]), deleteTask);
router.delete('/:boardId/completadas', checkBoardPermission(['owner', 'editor']), deleteCompletedTasks);

export default router;
