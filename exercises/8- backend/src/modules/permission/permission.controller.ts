import { Request, Response } from "express";
import { PermissionService } from "./permission.service";

export class PermissionController {
  private permissionService = new PermissionService();

  // Share a board with users
  shareBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId } = req.params;
      const { userEmails }: { userEmails: string[] } = req.body;

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      if (!boardId) {
        res.status(400).json({
          success: false,
          error: "Board ID is required",
        });
        return;
      }

      if (
        !userEmails ||
        !Array.isArray(userEmails) ||
        userEmails.length === 0
      ) {
        res.status(400).json({
          success: false,
          error: "User emails are required",
        });
        return;
      }

      const result = await this.permissionService.shareBoard(
        boardId,
        userEmails,
        req.user.id
      );

      res.json({
        success: true,
        data: result,
        message: `Board shared with ${result.shared.length} user(s)${
          result.notFound.length > 0
            ? `. Users not found: ${result.notFound.join(", ")}`
            : ""
        }`,
      });
    } catch (error) {
      console.error("Error sharing board:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to share board",
      });
    }
  };

  // Revoke access to a board
  revokeAccess = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId, userId: targetUserId } = req.params;

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      if (!boardId || !targetUserId) {
        res.status(400).json({
          success: false,
          error: "Board ID and User ID are required",
        });
        return;
      }

      await this.permissionService.revokeAccess(
        boardId,
        targetUserId,
        req.user.id
      );

      res.json({
        success: true,
        message: "Access revoked successfully",
      });
    } catch (error) {
      console.error("Error revoking access:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to revoke access",
      });
    }
  };

  // Get board permissions (who has access)
  getBoardPermissions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId } = req.params;

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      if (!boardId) {
        res.status(400).json({
          success: false,
          error: "Board ID is required",
        });
        return;
      }

      const permissions = await this.permissionService.getBoardPermissions(
        boardId,
        req.user.id
      );

      res.json({
        success: true,
        data: permissions,
      });
    } catch (error) {
      console.error("Error getting board permissions:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get board permissions",
      });
    }
  };

  // Get all users (for sharing interface)
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const users = await this.permissionService.getAllUsers();

      // Filter out the current user
      const filteredUsers = users.filter((user) => user.id !== req.user!.id);

      res.json({
        success: true,
        data: filteredUsers,
      });
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get users",
      });
    }
  };

  // Get notifications for current user
  getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const notifications = await this.permissionService.getNotifications(
        req.user.id,
        limit,
        offset
      );

      res.json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.error("Error getting notifications:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get notifications",
      });
    }
  };

  // Mark notification as read
  markNotificationAsRead = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { notificationId } = req.params;

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      if (!notificationId) {
        res.status(400).json({
          success: false,
          error: "Notification ID is required",
        });
        return;
      }

      const updated = await this.permissionService.markNotificationAsRead(
        notificationId,
        req.user.id
      );

      if (!updated) {
        res.status(404).json({
          success: false,
          error: "Notification not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Notification marked as read",
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark notification as read",
      });
    }
  };

  // Mark all notifications as read
  markAllNotificationsAsRead = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      await this.permissionService.markAllNotificationsAsRead(req.user.id);

      res.json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark all notifications as read",
      });
    }
  };

  // Get unread notification count
  getUnreadNotificationCount = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const count = await this.permissionService.getUnreadNotificationCount(
        req.user.id
      );

      res.json({
        success: true,
        data: { count },
      });
    } catch (error) {
      console.error("Error getting unread notification count:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get unread notification count",
      });
    }
  };
}
