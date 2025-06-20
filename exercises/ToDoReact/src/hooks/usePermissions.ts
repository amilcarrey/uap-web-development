import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BoardPermission,
  ApiResponse,
  User,
  Notification,
} from "../types/api";

const API_BASE_URL = "http://localhost:4322/api";

export const usePermissions = () => {
  const queryClient = useQueryClient();

  // Share board with users
  const shareBoard = useMutation({
    mutationFn: async ({
      boardId,
      userEmails,
    }: {
      boardId: string;
      userEmails: string[];
    }) => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/permissions/boards/${boardId}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userEmails }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to share board";

        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          // If we can't parse the response, use status-based messages
          if (response.status === 401) {
            errorMessage = "Invalid token. Please log in again.";
          } else if (response.status === 403) {
            errorMessage = "You don't have permission to share this board.";
          } else if (response.status === 404) {
            errorMessage = "Board not found.";
          }
        }

        throw new Error(errorMessage);
      }

      return response.json() as Promise<
        ApiResponse<{ shared: BoardPermission[]; notFound: string[] }>
      >;
    },
    onSuccess: () => {
      // Invalidate board list to refresh shared boards
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  // Revoke board access
  const revokeAccess = useMutation({
    mutationFn: async ({
      boardId,
      userId,
    }: {
      boardId: string;
      userId: string;
    }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/permissions/boards/${boardId}/permissions/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to revoke access");
      }

      return response.json() as Promise<ApiResponse<null>>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["board-permissions"] });
    },
  });

  // Get board permissions
  const getBoardPermissions = (boardId: string) =>
    useQuery({
      queryKey: ["board-permissions", boardId],
      queryFn: async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/permissions/boards/${boardId}/permissions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to get board permissions");
        }

        const data = (await response.json()) as ApiResponse<
          (BoardPermission & { username: string; email: string })[]
        >;
        return data.data;
      },
      enabled: !!boardId,
    });

  // Get all users (for sharing dropdown)
  const getAllUsers = () =>
    useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "No authentication token found. Please log in again."
          );
        }

        const response = await fetch(`${API_BASE_URL}/permissions/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let errorMessage = "Failed to get users";

          try {
            const error = await response.json();
            errorMessage = error.error || errorMessage;
          } catch {
            // If we can't parse the response, use status-based messages
            if (response.status === 401) {
              errorMessage = "Invalid token. Please log in again.";
            } else if (response.status === 403) {
              errorMessage = "You don't have permission to view users.";
            }
          }

          throw new Error(errorMessage);
        }

        const data = (await response.json()) as ApiResponse<User[]>;
        return data.data;
      },
    });

  return {
    shareBoard,
    revokeAccess,
    getBoardPermissions,
    getAllUsers,
  };
};

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Get notifications
  const getNotifications = (limit = 20, offset = 0) =>
    useQuery({
      queryKey: ["notifications", limit, offset],
      queryFn: async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/permissions/notifications?limit=${limit}&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to get notifications");
        }

        const data = (await response.json()) as ApiResponse<Notification[]>;
        return data.data;
      },
    });

  // Mark notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/permissions/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to mark notification as read");
      }

      return response.json() as Promise<ApiResponse<null>>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  // Mark all notifications as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/permissions/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "Failed to mark all notifications as read"
        );
      }

      return response.json() as Promise<ApiResponse<null>>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  // Get unread notification count
  const getUnreadCount = () =>
    useQuery({
      queryKey: ["unread-count"],
      queryFn: async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/permissions/notifications/unread-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to get unread count");
        }

        const data = (await response.json()) as ApiResponse<{ count: number }>;
        return data.data.count;
      },
      refetchInterval: 30000, // Refetch every 30 seconds
    });

  return {
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
  };
};
