import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiDelete } from "../lib/api";
import { useNotifications } from "../store/clientStore";
import type { ApiResponse, Board } from "../types/api";

export const tabKeys = {
  all: ["tabs"] as const,
};

// Transform board data to legacy tab format
const transformBoardsToTabs = (boards: Board[]): string[] => {
  return boards.map((board) => board.name);
};

const fetchTabs = async (): Promise<{ tabs: string[]; activeTab: string }> => {
  const response = await apiGet<ApiResponse<Board[]>>("/api/boards");
  const tabs = transformBoardsToTabs(response.data);
  return {
    tabs,
    activeTab: tabs[0] || "today", // Default to first board or "today"
  };
};

const addTabAPI = async (name: string): Promise<{ tab: string }> => {
  try {
    console.log(`➕ Creating new board with name: "${name}"`);

    // Validate name is not empty
    if (!name.trim()) {
      throw new Error("Board name cannot be empty");
    }

    const response = await apiPost<ApiResponse<Board>>("/api/boards", {
      name: name.trim(),
    });
    console.log(`✅ Board "${name}" created successfully`);

    return { tab: response.data.name };
  } catch (error) {
    console.error("❌ Error creating board:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to create board");
  }
};

const deleteTabAPI = async (name: string): Promise<{ message: string }> => {
  try {
    console.log(`🗑️ Attempting to delete board with name: "${name}"`);

    // First, find the board by name
    const boardsResponse = await apiGet<ApiResponse<Board[]>>("/api/boards");
    console.log(
      "📋 Available boards:",
      boardsResponse.data.map((b) => ({ id: b.id, name: b.name }))
    );

    const board = boardsResponse.data.find((b: Board) => b.name === name);

    if (!board) {
      console.error(
        `❌ Board "${name}" not found in:`,
        boardsResponse.data.map((b) => b.name)
      );
      throw new Error(
        `Board "${name}" not found. Available boards: ${boardsResponse.data
          .map((b) => b.name)
          .join(", ")}`
      );
    }

    console.log(`✅ Found board to delete:`, {
      id: board.id,
      name: board.name,
    });

    // Delete the board (this will also delete associated tasks due to CASCADE)
    const deleteResponse = await apiDelete<{
      success: boolean;
      message: string;
    }>(`/api/boards/${board.id}`);
    console.log(
      `🗑️ Successfully deleted board "${name}" with ID: ${board.id}`,
      deleteResponse
    );

    return {
      message:
        deleteResponse.message ||
        "Board and all its tasks deleted successfully",
    };
  } catch (error) {
    console.error("❌ Error deleting board:", error);

    if (error instanceof Error) {
      // Check if it's a JSON parsing error but the deletion might have succeeded
      if (
        error.message.includes("Unexpected end of JSON input") ||
        error.message.includes("Failed to execute 'json'")
      ) {
        console.log(
          "⚠️ JSON parsing error detected, but deletion might have succeeded"
        );

        // Verify if the board was actually deleted by refetching
        try {
          const verifyResponse = await apiGet<ApiResponse<Board[]>>(
            "/api/boards"
          );
          const stillExists = verifyResponse.data.find(
            (b: Board) => b.name === name
          );

          if (!stillExists) {
            console.log("✅ Board was successfully deleted despite JSON error");
            return { message: "Board and all its tasks deleted successfully" };
          } else {
            console.log("❌ Board still exists, deletion failed");
            throw new Error(`Failed to delete board "${name}": Server error`);
          }
        } catch (verifyError) {
          throw new Error(`Failed to delete board "${name}": ${error.message}`);
        }
      }

      // Re-throw with more specific error message
      throw new Error(`Failed to delete board "${name}": ${error.message}`);
    }

    throw new Error(`Failed to delete board "${name}": Unknown error`);
  }
};

export const useTabs = () => {
  return useQuery({
    queryKey: tabKeys.all,
    queryFn: fetchTabs,
    staleTime: 0, // Always refetch to ensure fresh tab data
    gcTime: 1 * 60 * 1000, // Keep data in cache for 1 minute
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });
};

export const useAddTab = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: addTabAPI,
    onSuccess: () => {
      console.log("🔄 Starting cache invalidation after board creation...");

      // Remove all cached data to force fresh fetch
      queryClient.removeQueries({ queryKey: tabKeys.all });
      queryClient.removeQueries({ queryKey: ["boards"] });
      queryClient.removeQueries({ queryKey: ["tasks"] });

      // Invalidate and refetch all related queries
      queryClient.invalidateQueries({ queryKey: tabKeys.all });
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      // Force immediate refetch to update the UI
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: tabKeys.all });
        queryClient.refetchQueries({ queryKey: ["boards"] });
        console.log("✅ Cache invalidated and refetched after board creation");
      }, 100);

      showSuccess("New tab!", "More jobs to do!");

      // Note: We don't handle UI state here to avoid conflicts with component state management
      // The component should handle setIsAddingTab(false) in its own onSuccess callback
    },
    onError: (error: Error) => {
      showError("¡No tab added!", error.message);
      // Note: We don't handle UI state here to avoid conflicts with component state management
      // The component should handle validation errors in its own onError callback
    },
  });
};

export const useDeleteTab = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: deleteTabAPI,
    onSuccess: () => {
      console.log("🔄 Starting cache invalidation after board deletion...");

      // Remove all cached data to force a fresh fetch
      queryClient.removeQueries({ queryKey: tabKeys.all });

      // Invalidate all tabs-related queries
      queryClient.invalidateQueries({ queryKey: tabKeys.all });

      // Also invalidate any task-related queries since tasks might be deleted too
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      // Force refetch tabs immediately to update the UI
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: tabKeys.all });
        console.log("✅ Cache invalidated and refetched after board deletion");
      }, 100);

      showSuccess(
        "Board deleted!",
        "The board and all its tasks have been removed successfully!"
      );
    },
    onError: (error: Error) => {
      console.error("❌ Delete tab error:", error);
      showError(
        "Failed to delete board!",
        error.message || "An unknown error occurred while deleting the board"
      );
    },
  });
};
