import {
  PermissionRepository,
  BoardPermission,
  BoardWithPermissions,
  Notification,
} from "./permission.repository";

export class PermissionService {
  private permissionRepository = new PermissionRepository();

  async shareBoard(
    boardId: string,
    userEmails: string[],
    sharedByUserId: string
  ): Promise<{
    success: boolean;
    shared: BoardPermission[];
    notFound: string[];
  }> {
    // First, get user IDs from emails
    const { userIds, notFoundEmails } = await this.getUserIdsByEmails(
      userEmails
    );

    // Validate that the user has permission to share this board
    const hasPermission = await this.permissionRepository.hasPermission(
      boardId,
      sharedByUserId,
      "owner"
    );
    if (!hasPermission) {
      throw new Error("You do not have permission to share this board");
    }

    const sharedPermissions = await this.permissionRepository.shareBoard(
      boardId,
      userIds,
      sharedByUserId
    );

    return {
      success: true,
      shared: sharedPermissions,
      notFound: notFoundEmails,
    };
  }

  async revokeAccess(
    boardId: string,
    userId: string,
    revokedByUserId: string
  ): Promise<void> {
    // Validate that the user has permission to revoke access
    const hasPermission = await this.permissionRepository.hasPermission(
      boardId,
      revokedByUserId,
      "owner"
    );
    if (!hasPermission) {
      throw new Error(
        "You do not have permission to revoke access to this board"
      );
    }

    await this.permissionRepository.revokeAccess(boardId, userId);
  }

  async getUserBoards(userId: string): Promise<BoardWithPermissions[]> {
    return await this.permissionRepository.getBoardsWithPermissions(userId);
  }

  async getBoardPermissions(
    boardId: string,
    requestingUserId: string
  ): Promise<(BoardPermission & { username: string; email: string })[]> {
    // Validate that the user has permission to view board permissions
    const hasPermission = await this.permissionRepository.hasPermission(
      boardId,
      requestingUserId,
      "owner"
    );
    if (!hasPermission) {
      throw new Error("You do not have permission to view board permissions");
    }

    return await this.permissionRepository.getBoardPermissions(boardId);
  }

  async hasPermission(
    boardId: string,
    userId: string,
    requiredLevel: "owner" | "editor" | "viewer"
  ): Promise<boolean> {
    return await this.permissionRepository.hasPermission(
      boardId,
      userId,
      requiredLevel
    );
  }

  async getAllUsers(): Promise<
    { id: string; username: string; email: string }[]
  > {
    // This method will be used to get list of users for sharing
    const { database } = await import("../../db/connection");

    const users = await database.all<{
      id: string;
      username: string;
      email: string;
    }>(`SELECT id, username, email FROM users ORDER BY username ASC`);

    return users;
  }

  private async getUserIdsByEmails(emails: string[]): Promise<{
    userIds: string[];
    notFoundEmails: string[];
  }> {
    const { database } = await import("../../db/connection");
    const userIds: string[] = [];
    const notFoundEmails: string[] = [];

    for (const email of emails) {
      const user = await database.get<{ id: string }>(
        `SELECT id FROM users WHERE email = ?`,
        [email.trim().toLowerCase()]
      );

      if (user) {
        userIds.push(user.id);
      } else {
        notFoundEmails.push(email);
      }
    }

    return { userIds, notFoundEmails };
  }

  async getNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Notification[]> {
    return await this.permissionRepository.getNotifications(
      userId,
      limit,
      offset
    );
  }

  async markNotificationAsRead(
    notificationId: string,
    userId: string
  ): Promise<boolean> {
    return await this.permissionRepository.markNotificationAsRead(
      notificationId,
      userId
    );
  }

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    return await this.permissionRepository.markAllNotificationsAsRead(userId);
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    return await this.permissionRepository.getUnreadNotificationCount(userId);
  }
}
