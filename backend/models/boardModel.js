import { connectDB } from "../db.js";

export async function getBoardsByUser(userId) {
  const db = await connectDB();
  return db.all(
    `SELECT boards.*, permissions.level
     FROM boards
     JOIN permissions ON boards.id = permissions.board_id
     WHERE permissions.user_id = ?`,
    [userId]
  );
}

export async function createBoard(name, ownerId) {
  const db = await connectDB();
  const { lastID } = await db.run(
    "INSERT INTO boards (name, owner_id) VALUES (?, ?)",
    [name, ownerId]
  );
  await db.run(
    "INSERT INTO permissions (user_id, board_id, level) VALUES (?, ?, 'owner')",
    [ownerId, lastID]
  );
  return { id: lastID, name, owner_id: ownerId };
}

export async function deleteBoard(boardId, userId) {
  const db = await connectDB();
  const perm = await db.get(
    "SELECT level FROM permissions WHERE user_id = ? AND board_id = ?",
    [userId, boardId]
  );
  if (!perm || perm.level !== "owner") throw new Error("No autorizado");

  await db.run("DELETE FROM tasks WHERE board_id = ?", [boardId]);
  await db.run("DELETE FROM permissions WHERE board_id = ?", [boardId]);
  await db.run("DELETE FROM boards WHERE id = ?", [boardId]);
}