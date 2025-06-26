import { database } from "../../db/connection";     
import { Board, CreateBoardRequest } from "../../types";
import { v4 as uuidv4 } from "uuid";
import {Request} from 'mssql';

export class BoardRepository {
  async getAllBoards(): Promise<Board[]> {
    return database.all<Board>("SELECT * FROM boards");
  }
  /**
   * Retrieves all boards associated with a specific user ID.
* This includes boards owned by the user and boards where the user has permissions.
   */
async getBoardsByUserId(user_id: string): Promise<any[]> {
  if (!user_id) throw new Error('Falta el user_id');

  const query = `
    SELECT 
      b.id,
      b.name,
      b.owner_id,
      CASE
        WHEN b.owner_id = ? THEN 'owner'
        ELSE p.access_level
      END as user_permission
    FROM dbo.boards b
    LEFT JOIN dbo.permissions p ON b.id = p.board_id AND p.user_id = ?
    WHERE b.owner_id = ? OR p.user_id = ?;
  `;

  try {
    return await database.all(query, [user_id, user_id, user_id, user_id]);
  } catch (error) {
    console.error('Error al obtener boards:', error);
    throw new Error('Error al buscar boards por usuario');
  }
}

  async getBoardById(id: string): Promise<Board | undefined> {
    return database.get<Board>("SELECT * FROM boards WHERE id = ?", [id]);
  }

  async createBoard(boardData: CreateBoardRequest): Promise<Board> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await database.run(
      "INSERT INTO boards (id, name, owner_id) VALUES (?, ?, ?)",
      [id, boardData.name, boardData.owner_id]
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

  async inviteUserToBoard(board_id: string, user_id: string, access_level: string): Promise<void> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await database.run(
      `INSERT INTO permissions (id, user_id, board_id, access_level, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, user_id, board_id, access_level, now, now]
    );
  }
}