import { database } from "../../db/connections";
import { Board, CreateBoardRequest } from "../../types";
import { v4 as uuidv4 } from "uuid";

export class BoardRepository {
  async getAllBoards(): Promise<Board[]> {
    return database.all<Board>("SELECT * FROM boards ORDER BY created_at DESC");
  }

  async getBoardById(id: string): Promise<Board | undefined> {
    return database.get<Board>("SELECT * FROM boards WHERE id = ?", [id]);
  }

  async getBoardsByUserId(userId: string): Promise<Board[]> {
    return database.all<Board>(
      `SELECT b.* FROM boards b
       JOIN board_users bu ON b.id = bu.board_id
       WHERE bu.user_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    );
  }

  async createBoard(boardData: CreateBoardRequest, customId?: string): Promise<Board> {
    const id = customId ?? uuidv4();
    const now = new Date().toISOString();

    await database.run(
      "INSERT INTO boards (id, name, created_at) VALUES (?, ?, ?)",
      [id, boardData.name || null, now]
    );

    const board = await this.getBoardById(id);
    if (!board) {
      throw new Error("Failed to create board");
    }

    return board;
  }

  async deleteBoard(id: string): Promise<boolean> {
    await database.run("DELETE FROM boards WHERE id = ?", [id]);
    return true;
  }

  async boardExists(id: string): Promise<boolean> {
    const board = await this.getBoardById(id);
    return !!board;
  }

  async addUserToBoard(userId: string, boardId: string, role: string): Promise<void> {
    await database.run(
      `INSERT INTO board_users (user_id, board_id, role)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, board_id) DO UPDATE SET role = excluded.role`,
      [userId, boardId, role]
    );
  }

  async userHasAccessToBoard(userId: string, boardId: string): Promise<boolean> {
    const result = await database.get(
      "SELECT 1 FROM board_users WHERE user_id = ? AND board_id = ?",
      [userId, boardId]
    );
    return !!result;
  }

  async getBoardRole(userId: string, boardId: string): Promise<{ role: string } | undefined> {
    return database.get(
      "SELECT role FROM board_users WHERE user_id = ? AND board_id = ?",
      [userId, boardId]
    );
  }
}