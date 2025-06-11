import { database } from "../../db/connection";
import {
  Board,
  CreateBoardRequest,
  UpdateBoardRequest,
  BoardPermission,
} from "../../types";
import { v4 as uuidv4 } from "uuid";

export class BoardRepository {
  async getAllBoardsByUser(userId: string): Promise<Board[]> {
    return database.all<Board>(
      `
      SELECT DISTINCT b.* 
      FROM boards b
      INNER JOIN board_permissions bp ON b.id = bp.board_id
      WHERE bp.user_id = ?
      ORDER BY b.created_at DESC
    `,
      [userId]
    );
  }

  async getBoardById(id: string, userId?: string): Promise<Board | undefined> {
    if (userId) {
      // Check if user has access to this board
      const board = await database.get<Board>(
        `
        SELECT b.* 
        FROM boards b
        INNER JOIN board_permissions bp ON b.id = bp.board_id
        WHERE b.id = ? AND bp.user_id = ?
      `,
        [id, userId]
      );
      return board;
    }

    return database.get<Board>("SELECT * FROM boards WHERE id = ?", [id]);
  }

  async createBoard(
    boardData: CreateBoardRequest,
    ownerId: string
  ): Promise<Board> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await database.run(
      "INSERT INTO boards (id, name, description, owner_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, boardData.name, boardData.description || null, ownerId, now, now]
    );

    // Create owner permission
    await database.run(
      "INSERT INTO board_permissions (id, board_id, user_id, permission_level, created_at) VALUES (?, ?, ?, ?, ?)",
      [uuidv4(), id, ownerId, "owner", now]
    );

    const board = await this.getBoardById(id);
    if (!board) {
      throw new Error("Failed to create board");
    }

    return board;
  }

  async updateBoard(
    id: string,
    boardData: UpdateBoardRequest
  ): Promise<Board | undefined> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (boardData.name !== undefined) {
      fields.push("name = ?");
      values.push(boardData.name);
    }

    if (boardData.description !== undefined) {
      fields.push("description = ?");
      values.push(boardData.description);
    }

    if (fields.length === 0) {
      return this.getBoardById(id);
    }

    fields.push("updated_at = ?");
    values.push(now, id);

    await database.run(
      `UPDATE boards SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.getBoardById(id);
  }

  async deleteBoard(id: string): Promise<boolean> {
    await database.run("DELETE FROM boards WHERE id = ?", [id]);
    return true;
  }

  async boardExists(id: string): Promise<boolean> {
    const board = await this.getBoardById(id);
    return !!board;
  }

  async getUserPermissionForBoard(
    boardId: string,
    userId: string
  ): Promise<BoardPermission | undefined> {
    return database.get<BoardPermission>(
      "SELECT * FROM board_permissions WHERE board_id = ? AND user_id = ?",
      [boardId, userId]
    );
  }

  async shareBoardWithUser(
    boardId: string,
    targetUserId: string,
    permissionLevel: "editor" | "viewer"
  ): Promise<BoardPermission> {
    const id = uuidv4();
    const now = new Date().toISOString();

    // Check if permission already exists
    const existingPermission = await this.getUserPermissionForBoard(
      boardId,
      targetUserId
    );
    if (existingPermission) {
      // Update existing permission
      await database.run(
        "UPDATE board_permissions SET permission_level = ? WHERE board_id = ? AND user_id = ?",
        [permissionLevel, boardId, targetUserId]
      );

      const updatedPermission = await this.getUserPermissionForBoard(
        boardId,
        targetUserId
      );
      if (!updatedPermission) {
        throw new Error("Failed to update board permission");
      }
      return updatedPermission;
    } else {
      // Create new permission
      await database.run(
        "INSERT INTO board_permissions (id, board_id, user_id, permission_level, created_at) VALUES (?, ?, ?, ?, ?)",
        [id, boardId, targetUserId, permissionLevel, now]
      );

      const permission = await this.getUserPermissionForBoard(
        boardId,
        targetUserId
      );
      if (!permission) {
        throw new Error("Failed to create board permission");
      }
      return permission;
    }
  }

  async removeBoardPermission(
    boardId: string,
    userId: string
  ): Promise<boolean> {
    await database.run(
      "DELETE FROM board_permissions WHERE board_id = ? AND user_id = ? AND permission_level != 'owner'",
      [boardId, userId]
    );
    return true;
  }

  async getBoardPermissions(
    boardId: string
  ): Promise<Array<BoardPermission & { username: string; email: string }>> {
    return database.all<BoardPermission & { username: string; email: string }>(
      `
      SELECT bp.*, u.username, u.email
      FROM board_permissions bp
      INNER JOIN users u ON bp.user_id = u.id
      WHERE bp.board_id = ?
      ORDER BY bp.permission_level, u.username
    `,
      [boardId]
    );
  }
}
