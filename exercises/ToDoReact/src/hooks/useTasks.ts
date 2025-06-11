import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import { useClientStore } from "../store/clientStore";
import { useNotifications } from "../store/clientStore";
import { useConfigStore } from "../store/configStore";
import { useBoardMapping } from "./useBoardMapping";
import type {
  ApiResponse,
  Task,
  BackendTasksResponse,
  LegacyTask,
  LegacyTasksResponse,
} from "../types/api";
import {
  transformTaskToLegacy,
  transformPaginationToLegacy,
} from "../types/api";

// Export legacy types for backward compatibility
export type { LegacyTask as Task, LegacyTasksResponse as TasksResponse };

//QUERY KEYS WITH CACHE MANAGEMENT
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (boardId: string, page: number, filter: string) =>
    [...taskKeys.lists(), { boardId, page, filter }] as const,
};

//API CALLS - Updated to use new backend endpoints
const fetchTasks = async (
  boardId: string,
  page: number,
  filter: string,
  itemsPerPage: number
): Promise<LegacyTasksResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: itemsPerPage.toString(),
  });

  // Add status filter if not "all"
  if (filter !== "all") {
    params.append("status", filter === "active" ? "pending" : "completed");
  }

  const response = await apiGet<ApiResponse<BackendTasksResponse>>(
    `/api/tasks/board/${boardId}?${params}`
  );

  // Transform backend response to legacy format
  return {
    tasks: response.data.items.map(transformTaskToLegacy),
    pagination: transformPaginationToLegacy(response.data.pagination),
  };
};

const addTaskAPI = async (data: {
  text: string;
  boardId: string;
}): Promise<LegacyTask> => {
  const response = await apiPost<ApiResponse<Task>>(
    `/api/tasks/board/${data.boardId}`,
    {
      text: data.text,
    }
  );
  return transformTaskToLegacy(response.data);
};

const updateTaskAPI = async (data: {
  id: number;
  text?: string;
  completed?: boolean;
}): Promise<LegacyTask> => {
  const updateData: Partial<{ text: string; completed: boolean }> = {};
  if (data.text !== undefined) updateData.text = data.text;
  if (data.completed !== undefined) updateData.completed = data.completed;

  const response = await apiPut<ApiResponse<Task>>(
    `/api/tasks/${data.id}`,
    updateData
  );
  return transformTaskToLegacy(response.data);
};

const deleteTaskAPI = async (id: number): Promise<void> => {
  await apiDelete(`/api/tasks/${id}`);
};

const clearCompletedAPI = async (boardId: string): Promise<void> => {
  await apiPost(`/api/tasks/board/${boardId}/clear-completed`);
};

//CUSTOM HOOKS
export const useTasks = () => {
  const { activeTab, filter, currentPage, itemsPerPage } = useClientStore();
  const { config } = useConfigStore();
  const { getBoardIdByName, getFirstBoardId } = useBoardMapping();

  // Get board ID from active tab name, or use first board if no match
  const boardId = getBoardIdByName(activeTab) || getFirstBoardId();

  return useQuery({
    queryKey: taskKeys.list(boardId || "", currentPage, filter),
    queryFn: () => fetchTasks(boardId || "", currentPage, filter, itemsPerPage),
    enabled: !!boardId,
    staleTime: 30 * 1000,
    refetchInterval: config.taskRefetchInterval * 1000,
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  const { resetPage } = useClientStore();
  const { showSuccess, showError } = useNotifications();
  const { getBoardIdByName, getFirstBoardId } = useBoardMapping();

  return useMutation({
    mutationFn: (data: { text: string; tab: string }) => {
      const boardId = getBoardIdByName(data.tab) || getFirstBoardId();
      if (!boardId) throw new Error("No board available");
      return addTaskAPI({ text: data.text, boardId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      resetPage();
      showSuccess("Head to the counter", "Task added successfully!");
    },
    onError: (error: Error) => {
      showError("Shut!", error.message);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: updateTaskAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      showSuccess("Sound!', Let's do it again!");
    },
    onError: (error: Error) => {
      showError("¡!", `It couldn't be updated: ${error.message}`);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: deleteTaskAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      showSuccess("Task deleted!");
    },
    onError: (error: Error) => {
      showError("It couldn't be deleted", error.message);
    },
  });
};

export const useClearCompleted = () => {
  const queryClient = useQueryClient();
  const { activeTab } = useClientStore();
  const { showSuccess, showError } = useNotifications();
  const { getBoardIdByName, getFirstBoardId } = useBoardMapping();

  return useMutation({
    mutationFn: () => {
      const boardId = getBoardIdByName(activeTab) || getFirstBoardId();
      if (!boardId) throw new Error("No board available");
      return clearCompletedAPI(boardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      showSuccess("All right folks, last orders!", "Time for last orders");
    },
    onError: (error: Error) => {
      showError("Fuck off!", error.message);
    },
  });
};
