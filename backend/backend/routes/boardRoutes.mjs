import express from "express";
import { connectDB } from "../db.mjs";
import { authenticateToken } from "../middleware/authMiddleware.mjs";

const router = express.Router();

// Obtener tableros donde el usuario tiene permisos
router.get("/", authenticateToken, async (req, res) => {
  const db = await connectDB();
  const boards = await db.all(`
    SELECT b.id, b.name, p.level
    FROM boards b
    JOIN permissions p ON b.id = p.board_id
    WHERE p.user_id = ?
  `, [req.user.id]);

  res.json(boards);
});

// Crear nuevo tablero y asignarlo al usuario como propietario
router.post("/", authenticateToken, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Falta el nombre del tablero" });

  const db = await connectDB();
  const result = await db.run("INSERT INTO boards (name, owner_id) VALUES (?, ?)", [name, req.user.id]);
  const boardId = result.lastID;

  await db.run("INSERT INTO permissions (user_id, board_id, level) VALUES (?, ?, 'owner')", [req.user.id, boardId]);

  res.status(201).json({ id: boardId, name });
});

// Compartir tablero con otro usuario
router.post("/:id/share", authenticateToken, async (req, res) => {
  const boardId = req.params.id;
  const { username, level } = req.body;

  const db = await connectDB();

  // Validar si el usuario actual es el propietario
  const board = await db.get("SELECT * FROM boards WHERE id = ?", [boardId]);
  if (!board || board.owner_id !== req.user.id) {
    return res.status(403).json({ error: "Solo el propietario puede compartir" });
  }

  // Buscar al usuario a compartir
  const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  // Insertar permiso (o actualizar si ya existe)
  const existing = await db.get("SELECT * FROM permissions WHERE board_id = ? AND user_id = ?", [boardId, user.id]);
  if (existing) {
    await db.run("UPDATE permissions SET level = ? WHERE board_id = ? AND user_id = ?", [level, boardId, user.id]);
  } else {
    await db.run("INSERT INTO permissions (user_id, board_id, level) VALUES (?, ?, ?)", [user.id, boardId, level]);
  }

  res.send("Permiso actualizado");
});

// Eliminar un tablero (solo propietarios)
router.delete("/:id", authenticateToken, async (req, res) => {
  const boardId = req.params.id;
  const db = await connectDB();

  const board = await db.get("SELECT * FROM boards WHERE id = ?", [boardId]);
  if (!board || board.owner_id !== req.user.id) {
    return res.status(403).json({ error: "No autorizado para eliminar este tablero" });
  }

  // Eliminar tareas relacionadas
  await db.run("DELETE FROM tasks WHERE board_id = ?", [boardId]);

  // Eliminar permisos
  await db.run("DELETE FROM permissions WHERE board_id = ?", [boardId]);

  // Eliminar el tablero
  await db.run("DELETE FROM boards WHERE id = ?", [boardId]);

  res.send("Tablero eliminado");
});

export default router;