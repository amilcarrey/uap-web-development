/* recordar:
el repositorio de tableros para leer, crear y eliminar tableros
desde la base de datos
*/
import { database } from "../../db/connection";
import { Board } from "../../types";
import { v4 as uuidv4 } from "uuid";

async function getAll(userId: string): Promise<Board[]> {
  return await database.all<Board>(
    `SELECT * FROM boards b
     JOIN board_permissions bp ON bp.board_id = b.id
     WHERE bp.user_id = ?`,
    [userId]
  );
}

async function getById(id: string): Promise<Board | undefined> {
  return await database.get<Board>("SELECT * FROM boards WHERE id = ?", [id]);
}

async function create(name: string, description: string, owner_id: string): Promise<Board> {
  const id = uuidv4();
  const now = new Date().toISOString();

  await database.run(
    `INSERT INTO boards (id, name, description, created_at, updated_at, owner_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, description, now, now, owner_id]
  );

  await database.run(
    `INSERT INTO board_permissions (board_id, user_id, role)
     VALUES (?, ?, ?)`,
    [id, owner_id, "owner"]
  );

  return (await database.get<Board>("SELECT * FROM boards WHERE id = ?", [id]))!;
}

async function addPermission(boardId: string, userId: string, role: "owner" | "editor" | "viewer"): Promise<void> {
  await database.run(
    `INSERT INTO board_permissions (board_id, user_id, role)
     VALUES (?, ?, ?)`,
    [boardId, userId, role]
  );
}

async function deleteBoard(id: string): Promise<void> {
  await database.run("DELETE FROM boards WHERE id = ?", [id]);
}

async function getUsersWithPermissions(boardId: string) {
  return await database.all<{ id: string; email: string; role: string }>(
    `SELECT u.id, u.email, bp.role
     FROM board_permissions bp
     JOIN users u ON u.id = bp.user_id
     WHERE bp.board_id = ?`,
    [boardId]
  );
}

export const BoardRepository = {
  getAll,
  getById,
  create,
  addPermission,
  delete: deleteBoard,
  getUsersWithPermissions,
};
