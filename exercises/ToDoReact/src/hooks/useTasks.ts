import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import { useClientStore } from "../store/clientStore";
import { useNotifications } from "../store/clientStore";
import { useConfigStore } from "../store/configStore";
import { useBoardMapping } from "./useBoardMapping";
import { useEffect } from "react";
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
  list: (boardId: string, page: number, filter: string, search?: string) =>
    [...taskKeys.lists(), { boardId, page, filter, search }] as const,
};

//API CALLS - Updated to use new backend endpoints
const fetchTasks = async (
  boardId: string,
  page: number,
  filter: string,
  itemsPerPage: number,
  search?: string
): Promise<LegacyTasksResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: itemsPerPage.toString(),
  });

  // Add status filter if not "all"
  if (filter !== "all") {
    params.append("status", filter === "active" ? "pending" : "completed");
  }

  // Add search parameter if provided
  if (search && search.trim()) {
    params.append("search", search.trim());
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
  id: string;
  text?: string;
  completed?: boolean;
}): Promise<LegacyTask> => {
  const updateData: Partial<{ text: string; completed: boolean }> = {};
  if (data.text !== undefined) updateData.text = data.text;
  if (data.completed !== undefined) updateData.completed = data.completed;

  console.log("🔄 API call - updateTask:", {
    taskId: data.id,
    updateData,
    endpoint: `/api/tasks/${data.id}`,
  });

  const response = await apiPut<ApiResponse<Task>>(
    `/api/tasks/${data.id}`,
    updateData
  );

  console.log("✅ API response - updateTask:", response);
  return transformTaskToLegacy(response.data);
};

const deleteTaskAPI = async (id: string): Promise<void> => {
  await apiDelete(`/api/tasks/${id}`);
};

const clearCompletedAPI = async (boardId: string): Promise<void> => {
  await apiPost(`/api/tasks/board/${boardId}/clear-completed`);
};

// Custom hook to handle tab changes and cache invalidation
export const useTabChangeEffect = () => {
  const { activeTab } = useClientStore();
  const queryClient = useQueryClient();
  const { getBoardIdByName } = useBoardMapping();

  useEffect(() => {
    console.log(`🔄 Tab change detected: ${activeTab}`);

    // First, invalidate the boards query to get fresh board data
    queryClient.invalidateQueries({ queryKey: ["boards"] });

    // Wait a bit for the boards to be refetched, then get boardId
    setTimeout(() => {
      const boardId = getBoardIdByName(activeTab);

      console.log(
        `🔄 Processing tab change to: ${activeTab} (boardId: ${boardId})`
      );

      // Always invalidate all task queries to force fresh data
      queryClient.invalidateQueries({ queryKey: taskKeys.all });

      // Remove stale data from other boards to prevent cache confusion
      queryClient.removeQueries({
        queryKey: taskKeys.lists(),
        predicate: (query) => {
          const queryData = query.queryKey[2] as
            | { boardId: string }
            | undefined;
          return queryData?.boardId !== boardId;
        },
      });

      // If we have a valid boardId, force refetch tasks for this board
      if (boardId) {
        queryClient.refetchQueries({
          queryKey: taskKeys.lists(),
          predicate: (query) => {
            const queryData = query.queryKey[2] as
              | { boardId: string }
              | undefined;
            return queryData?.boardId === boardId;
          },
        });
      }
    }, 150); // Give time for boards query to complete
  }, [activeTab, queryClient, getBoardIdByName]);
};

//CUSTOM HOOKS
export const useTasks = (search?: string) => {
  const { activeTab, filter, currentPage, itemsPerPage } = useClientStore();
  const { config } = useConfigStore();
  const { getBoardIdByName, getFirstBoardId, boards } = useBoardMapping();

  // Handle tab changes and cache invalidation
  useTabChangeEffect();

  // Get board ID from active tab name, or use first board if no match
  const boardId = getBoardIdByName(activeTab) || getFirstBoardId();

  console.log(
    `📋 useTasks: activeTab="${activeTab}", boardId="${boardId}", filter="${filter}", page=${currentPage}, search="${
      search || ""
    }"`
  );
  console.log(
    `📋 Available boards:`,
    boards.map((b) => ({ id: b.id, name: b.name }))
  );

  return useQuery({
    queryKey: taskKeys.list(boardId || "", currentPage, filter, search),
    queryFn: () => {
      console.log(
        `🔄 Fetching tasks for board: ${boardId}, filter: ${filter}, page: ${currentPage}, search: ${
          search || ""
        }`
      );
      if (!boardId) {
        throw new Error("No board ID available");
      }
      return fetchTasks(boardId, currentPage, filter, itemsPerPage, search);
    },
    enabled: !!boardId && boards.length > 0, // Ensure we have boards data before fetching tasks
    staleTime: 0, // Always fetch fresh data when switching boards
    gcTime: 2 * 60 * 1000, // Keep data in cache for 2 minutes
    refetchInterval: config.taskRefetchInterval * 1000,
    refetchOnWindowFocus: true, // Refetch when window gains focus
    retry: (failureCount, error) => {
      // If board not found, retry a few times as it might be a new board
      if (error.message.includes("No board ID available") && failureCount < 3) {
        return true;
      }
      return false;
    },
    retryDelay: 500, // Wait 500ms between retries
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
    mutationFn: async (data: {
      id: string;
      text?: string;
      completed?: boolean;
    }) => {
      console.log("🔄 Updating task:", data);
      const result = await updateTaskAPI(data);
      console.log("✅ Task update successful:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      showSuccess("Sound!', Let's do it again!");
    },
    onError: (error: Error) => {
      console.error("❌ Task update failed:", error);
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
