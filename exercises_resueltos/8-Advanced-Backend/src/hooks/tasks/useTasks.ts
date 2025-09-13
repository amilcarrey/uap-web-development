import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Task } from "../../types/task"; // Assuming Task type is { id, title, completed, boardId?, ... }
import { useUIStore } from "../../store/useUIStore"; // For page, filter if still used client-side

// Backend response for paginated tasks
interface PaginatedTasksResponse {
  tasks: Task[];
  totalTasks: number;
  totalPages: number;
  currentPage: number;
}

export const TASKS_PER_PAGE = 10; // This can be a default limit

export const useTasks = (boardId: number | null) => {
  const uiFilter = useUIStore((s) => s.filter); // 'all', 'active', 'completed'
  const page = useUIStore((s) => s.page);
  // TODO: Add searchTerm and sortBy from a store or props if implementing UI for these

  // Map UI filter to backend status query
  let statusQuery: string | undefined = undefined;
  if (uiFilter === "active") statusQuery = "todo,in-progress"; // Or just 'todo' and 'in-progress' if backend supports multiple
  if (uiFilter === "completed") statusQuery = "done";


  return useQuery<PaginatedTasksResponse, Error>({
    // Query key needs to include boardId to refetch when board changes
    queryKey: ["tasks", boardId, statusQuery, page /*, searchTerm, sortBy, sortOrder */],
    queryFn: async () => {
      if (!boardId) { // Do not fetch if no board is selected
        return { tasks: [], totalTasks: 0, totalPages: 0, currentPage: 1 };
      }
      // Backend endpoint: GET /boards/:boardId/tasks
      // Backend params: page, limit, status, sortBy, sortOrder, searchTerm
      const response = await api.get(`/boards/${boardId}/tasks`, {
        params: {
          page: page,
          limit: TASKS_PER_PAGE,
          status: statusQuery, // 'todo', 'in-progress', 'done', or comma-separated for multiple
          // sortBy: 'createdAt', // Default sort or make configurable
          // sortOrder: 'DESC',   // Default sort or make configurable
          // searchTerm: '',      // If search is implemented
        },
      });
      // Assuming backend response matches PaginatedTasksResponse structure
      return response.data;
    },
  });
};