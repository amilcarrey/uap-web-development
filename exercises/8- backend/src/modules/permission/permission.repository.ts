import { database } from "../../db/connection";
import { v4 as uuidv4 } from "uuid";

export interface BoardPermission {
  id: string;
  board_id: string;
  user_id: string;
  permission_level: "owner" | "editor" | "viewer";
  created_at: string;
}

export interface BoardWithPermissions {
  id: string;
  name: string;
  owner_id: string;
  description?: string;
  created_at: string;
  updated_at: string;
  permission_level: "owner" | "editor" | "viewer";
  owner_username?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: string;
  read: boolean;
  created_at: string;
}

export class PermissionRepository {
  private db = database;

  async shareBoard(
    boardId: string,
    userIds: string[],
    sharedByUserId: string
  ): Promise<BoardPermission[]> {
    const permissions: BoardPermission[] = [];

    for (const userId of userIds) {
      // Check if permission already exists
      const existingPermission = await this.db.get<BoardPermission>(
        `SELECT * FROM board_permissions WHERE board_id = ? AND user_id = ?`,
        [boardId, userId]
      );

      if (!existingPermission) {
        const permissionId = uuidv4();
        await this.db.run(
          `INSERT INTO board_permissions (id, board_id, user_id, permission_level, created_at)
           VALUES (?, ?, ?, ?, datetime('now'))`,
          [permissionId, boardId, userId, "viewer"]
        );

        const permission = await this.db.get<BoardPermission>(
          `SELECT * FROM board_permissions WHERE id = ?`,
          [permissionId]
        );

        if (permission) {
          permissions.push(permission);
        }

        // Create notification for shared user
        await this.createShareNotification(boardId, userId, sharedByUserId);
      }
    }

    return permissions;
  }

  async revokeAccess(boardId: string, userId: string): Promise<void> {
    await this.db.run(
      `DELETE FROM board_permissions WHERE board_id = ? AND user_id = ? AND permission_level != 'owner'`,
      [boardId, userId]
    );

    // Create notification for revoked user
    await this.createRevokeNotification(boardId, userId);
  }

  async getBoardsWithPermissions(
    userId: string
  ): Promise<BoardWithPermissions[]> {
    const boards = await this.db.all<BoardWithPermissions>(
      `SELECT 
        b.id, b.name, b.owner_id, b.description, b.created_at, b.updated_at,
        COALESCE(bp.permission_level, 'owner') as permission_level,
        u.username as owner_username
      FROM boards b
      LEFT JOIN board_permissions bp ON b.id = bp.board_id AND bp.user_id = ?
      LEFT JOIN users u ON b.owner_id = u.id
      WHERE b.owner_id = ? OR bp.user_id = ?
      ORDER BY b.created_at DESC`,
      [userId, userId, userId]
    );

    return boards;
  }

  async getBoardPermissions(
    boardId: string
  ): Promise<(BoardPermission & { username: string; email: string })[]> {
    const permissions = await this.db.all<
      BoardPermission & { username: string; email: string }
    >(
      `SELECT bp.*, u.username, u.email 
       FROM board_permissions bp
       JOIN users u ON bp.user_id = u.id
       WHERE bp.board_id = ?
       ORDER BY bp.created_at DESC`,
      [boardId]
    );

    return permissions;
  }

  async hasPermission(
    boardId: string,
    userId: string,
    requiredLevel: "owner" | "editor" | "viewer"
  ): Promise<boolean> {
    // Check if user is owner
    const board = await this.db.get<{ owner_id: string }>(
      `SELECT owner_id FROM boards WHERE id = ?`,
      [boardId]
    );

    if (board?.owner_id === userId) {
      return true; // Owner has all permissions
    }

    // Check explicit permissions
    const permission = await this.db.get<BoardPermission>(
      `SELECT * FROM board_permissions WHERE board_id = ? AND user_id = ?`,
      [boardId, userId]
    );

    if (!permission) {
      return false;
    }

    // Check permission hierarchy: owner > editor > viewer
    const permissionHierarchy: Record<"owner" | "editor" | "viewer", number> = {
      owner: 3,
      editor: 2,
      viewer: 1,
    };
    return (
      permissionHierarchy[permission.permission_level] >=
      permissionHierarchy[requiredLevel]
    );
  }

  private async createShareNotification(
    boardId: string,
    userId: string,
    sharedByUserId: string
  ): Promise<void> {
    const board = await this.db.get<{ name: string }>(
      `SELECT name FROM boards WHERE id = ?`,
      [boardId]
    );
    const sharedByUser = await this.db.get<{ username: string }>(
      `SELECT username FROM users WHERE id = ?`,
      [sharedByUserId]
    );

    if (board && sharedByUser) {
      const notificationId = uuidv4();
      await this.db.run(
        `INSERT INTO notifications (id, user_id, type, title, message, data, created_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          notificationId,
          userId,
          "board_shared",
          "New Board Shared",
          `${sharedByUser.username} shared the board "${board.name}" with you`,
          JSON.stringify({ board_id: boardId, shared_by: sharedByUserId }),
        ]
      );
    }
  }

  private async createRevokeNotification(
    boardId: string,
    userId: string
  ): Promise<void> {
    const board = await this.db.get<{ name: string }>(
      `SELECT name FROM boards WHERE id = ?`,
      [boardId]
    );

    if (board) {
      const notificationId = uuidv4();
      await this.db.run(
        `INSERT INTO notifications (id, user_id, type, title, message, data, created_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          notificationId,
          userId,
          "board_access_revoked",
          "Board Access Revoked",
          `Your access to the board "${board.name}" has been revoked`,
          JSON.stringify({ board_id: boardId }),
        ]
      );
    }
  }

  async getNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Notification[]> {
    return (await this.db.all<Notification>(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    )) as Notification[];
  }

  async markNotificationAsRead(
    notificationId: string,
    userId: string
  ): Promise<boolean> {
    const result = await this.db.run(
      `UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?`,
      [notificationId, userId]
    );
    return (result as any).changes > 0;
  }

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    const result = await this.db.run(
      `UPDATE notifications SET read = 1 WHERE user_id = ? AND read = 0`,
      [userId]
    );
    return (result as any).changes > 0;
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const result = await this.db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0`,
      [userId]
    );
    return result?.count || 0;
  }
}
