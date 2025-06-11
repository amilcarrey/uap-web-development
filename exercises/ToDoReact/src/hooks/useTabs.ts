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
  const response = await apiPost<ApiResponse<Board>>("/api/boards", { name });
  return { tab: response.data.name };
};

const deleteTabAPI = async (name: string): Promise<{ message: string }> => {
  // First, find the board by name
  const boardsResponse = await apiGet<ApiResponse<Board[]>>("/api/boards");
  const board = boardsResponse.data.find((b: Board) => b.name === name);

  if (!board) {
    throw new Error(`Board "${name}" not found`);
  }

  await apiDelete(`/api/boards/${board.id}`);
  return { message: "Board deleted successfully" };
};

export const useTabs = () => {
  return useQuery({
    queryKey: tabKeys.all,
    queryFn: fetchTabs,
    staleTime: 30 * 1000,
  });
};

export const useAddTab = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: addTabAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tabKeys.all });
      showSuccess("New tab!", "More jobs to do!");
    },
    onError: (error: Error) => {
      showError("¡No tab added!", error.message);
    },
  });
};

export const useDeleteTab = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: deleteTabAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tabKeys.all });
      showSuccess("Tab deleted!", "One less board to manage!");
    },
    onError: (error: Error) => {
      showError("Failed to delete tab!", error.message);
    },
  });
};
