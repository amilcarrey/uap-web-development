import express from "express";
import { connectDB } from "../db.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

// Obtener tareas con paginación, filtro y búsqueda
router.get("/:boardId", async (req, res) => {
  const db = await connectDB();
  const { boardId } = req.params;
  const { page = 1, limit = 5, filter = "all", search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Verificar si el usuario tiene permisos sobre el tablero
    const permission = await db.get(`
      SELECT * FROM permissions
      WHERE board_id = ? AND user_id = ?
    `, [boardId, req.user.id]);

    if (!permission) return res.status(403).json({ error: "Sin permiso para ver este tablero" });

    const tasks = await db.all(`
      SELECT * FROM tasks
      WHERE board_id = ?
        AND text LIKE ?
        AND (
          (? = 'all')
          OR (? = 'completed' AND completed = 1)
          OR (? = 'active' AND completed = 0)
        )
      LIMIT ? OFFSET ?
    `, [boardId, `%${search}%`, filter, filter, filter, limit, offset]);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener tareas" });
  }
});

// Crear tarea
router.post("/:boardId", async (req, res) => {
  const db = await connectDB();
  const { boardId } = req.params;
  const { text } = req.body;

  const permission = await db.get(`
    SELECT * FROM permissions
    WHERE board_id = ? AND user_id = ? AND level IN ('owner', 'editor')
  `, [boardId, req.user.id]);

  if (!permission) return res.status(403).json({ error: "Sin permiso para agregar tareas" });

  await db.run(`
    INSERT INTO tasks (text, completed, board_id)
    VALUES (?, 0, ?)
  `, [text, boardId]);

  res.status(201).send("Tarea creada");
});

// Editar tarea
router.put("/:taskId", async (req, res) => {
  const db = await connectDB();
  const { taskId } = req.params;
  const { text, completed } = req.body;

  const task = await db.get("SELECT * FROM tasks WHERE id = ?", [taskId]);
  if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

  const permission = await db.get(`
    SELECT * FROM permissions
    WHERE board_id = ? AND user_id = ? AND level IN ('owner', 'editor')
  `, [task.board_id, req.user.id]);

  if (!permission) return res.status(403).json({ error: "Sin permiso para editar tarea" });

  await db.run(`
    UPDATE tasks SET text = ?, completed = ?
    WHERE id = ?
  `, [text, completed ? 1 : 0, taskId]);

  res.send("Tarea actualizada");
});

// Eliminar tarea
router.delete("/:taskId", async (req, res) => {
  const db = await connectDB();
  const { taskId } = req.params;

  const task = await db.get("SELECT * FROM tasks WHERE id = ?", [taskId]);
  if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

  const permission = await db.get(`
    SELECT * FROM permissions
    WHERE board_id = ? AND user_id = ? AND level IN ('owner', 'editor')
  `, [task.board_id, req.user.id]);

  if (!permission) return res.status(403).json({ error: "Sin permiso para eliminar tarea" });

  await db.run("DELETE FROM tasks WHERE id = ?", [taskId]);
  res.send("Tarea eliminada");
});

// Eliminar completadas en lote
router.delete("/clear/:boardId", async (req, res) => {
  const db = await connectDB();
  const { boardId } = req.params;

  const permission = await db.get(`
    SELECT * FROM permissions
    WHERE board_id = ? AND user_id = ? AND level IN ('owner', 'editor')
  `, [boardId, req.user.id]);

  if (!permission) return res.status(403).json({ error: "Sin permiso para limpiar tareas" });

  await db.run(`
    DELETE FROM tasks
    WHERE board_id = ? AND completed = 1
  `, [boardId]);

  res.send("Tareas completadas eliminadas");
});

export default router;