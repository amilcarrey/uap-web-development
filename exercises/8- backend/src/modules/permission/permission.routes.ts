import { Router } from "express";
import { PermissionController } from "./permission.controller";
import { authenticateToken } from "../../middleware/auth.middleware";

const router = Router();
const permissionController = new PermissionController();

// All routes require authentication
router.use(authenticateToken);

// Share a board with users by email
router.post("/boards/:boardId/share", permissionController.shareBoard);

// Revoke access to a board for a specific user
router.delete(
  "/boards/:boardId/permissions/:userId",
  permissionController.revokeAccess
);

// Get all permissions for a board (who has access)
router.get(
  "/boards/:boardId/permissions",
  permissionController.getBoardPermissions
);

// Get all users (for sharing interface)
router.get("/users", permissionController.getAllUsers);

// Notification routes
router.get("/notifications", permissionController.getNotifications);
router.patch(
  "/notifications/:notificationId/read",
  permissionController.markNotificationAsRead
);
router.patch(
  "/notifications/read-all",
  permissionController.markAllNotificationsAsRead
);
router.get(
  "/notifications/unread-count",
  permissionController.getUnreadNotificationCount
);

export default router;
