import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useClientStore } from "../store/clientStore";
import { useNotifications } from "../store/clientStore";
import { useConfigStore } from "../store/configStore";

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startItem: number;
    endItem: number;
  };
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4322";

//QUERY KEYS WITH CACHE MANAGEMENT
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (tab: string, page: number, filter: string) =>
    [...taskKeys.lists(), { tab, page, filter }] as const,
};

//API CALLS FROM THE AJAX ASTRO PROJECT
const fetchTasks = async (
  tab: string,
  page: number,
  filter: string,
  itemsPerPage: number
): Promise<TasksResponse> => {
  const params = new URLSearchParams({
    tab,
    page: page.toString(),
    filter:
      filter === "all"
        ? "all"
        : filter === "active"
          ? "incomplete"
          : "complete",
    limit: itemsPerPage.toString(),
  });

  const response = await fetch(`${API_URL}/api/tasks?${params}`);
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  return response.json();
};

const addTaskAPI = async (data: {
  text: string;
  tab: string;
}): Promise<Task> => {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const result = await response.json();
  return result.task;
};

const updateTaskAPI = async (data: {
  id: number;
  text?: string;
  completed?: boolean;
}): Promise<Task> => {
  const response = await fetch(`${API_URL}/api/tasks/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const result = await response.json();
  return result.task;
};

const deleteTaskAPI = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Error: ${response.status}`);
};

const clearCompletedAPI = async (tab: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/tasks/clear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tab }),
  });
  if (!response.ok) throw new Error(`Error: ${response.status}`);
};

//CUSTOM HOOKS
export const useTasks = () => {
  const { activeTab, filter, currentPage, itemsPerPage } = useClientStore();
  const { config } = useConfigStore();

  return useQuery({
    queryKey: taskKeys.list(activeTab, currentPage, filter),
    queryFn: () => fetchTasks(activeTab, currentPage, filter, itemsPerPage),
    enabled: !!activeTab,
    staleTime: 30 * 1000,
    refetchInterval: config.taskRefetchInterval * 1000,
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  const { resetPage } = useClientStore();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: addTaskAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      resetPage();
      showSuccess("Head to the counter", "Task added successfully!");
    },
    onError: (error) => {
      showError("Shut!", `${error.message}`);
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
    onError: (error) => {
      showError("¡!", `It couldn't be deleted: ${error.message}`);
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
    onError: (error) => {
      showError("It couldn't be deleted", `${error.message}`);
    },
  });
};

export const useClearCompleted = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: clearCompletedAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      showSuccess("All right folks, last orders!", "Time for last orders");
    },
    onError: (error) => {
      showError("Fuck off!", `${error.message}`);
    },
  });
};
