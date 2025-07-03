import express from "express";
import { connectDB } from "../db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

// Obtener tareas del tablero
router.get("/:boardId", async (req, res) => {
  const db = await connectDB();
  const { boardId } = req.params;
  const userId = req.user.id;

  const permission = await db.get(
    "SELECT level FROM permissions WHERE user_id = ? AND board_id = ?",
    [userId, boardId]
  );

  if (!permission) return res.status(403).json({ error: "Sin permiso para ver tareas" });

  const tasks = await db.all("SELECT * FROM tasks WHERE board_id = ?", [boardId]);
  res.json(tasks);
});

// Crear tarea
router.post("/:boardId", async (req, res) => {
  const db = await connectDB();
  const { boardId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  const permission = await db.get(
    "SELECT level FROM permissions WHERE user_id = ? AND board_id = ?",
    [userId, boardId]
  );
  if (!permission || permission.level === "viewer")
    return res.status(403).json({ error: "Sin permiso para crear tareas" });

  const result = await db.run(
    "INSERT INTO tasks (text, completed, board_id) VALUES (?, false, ?)",
    [text, boardId]
  );
  const task = await db.get("SELECT * FROM tasks WHERE id = ?", [result.lastID]);
  res.status(201).json(task);
});

// Marcar completada / toggle
router.patch("/:id", async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  const userId = req.user.id;

  const task = await db.get("SELECT * FROM tasks WHERE id = ?", [id]);
  if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

  const permission = await db.get(
    "SELECT level FROM permissions WHERE user_id = ? AND board_id = ?",
    [userId, task.board_id]
  );
  if (!permission || permission.level === "viewer")
    return res.status(403).json({ error: "Sin permiso para editar tareas" });

  const updated = {
    ...task,
    completed: !task.completed,
  };

  await db.run("UPDATE tasks SET completed = ? WHERE id = ?", [
    updated.completed,
    id,
  ]);

  res.json(updated);
});

// Eliminar tarea
router.delete("/:id", async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  const userId = req.user.id;

  const task = await db.get("SELECT * FROM tasks WHERE id = ?", [id]);
  if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

  const permission = await db.get(
    "SELECT level FROM permissions WHERE user_id = ? AND board_id = ?",
    [userId, task.board_id]
  );
  if (!permission || permission.level === "viewer")
    return res.status(403).json({ error: "Sin permiso para eliminar tareas" });

  await db.run("DELETE FROM tasks WHERE id = ?", [id]);
  res.send("Tarea eliminada");
});

export default router;