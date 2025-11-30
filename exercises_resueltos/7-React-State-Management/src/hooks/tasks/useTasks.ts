import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Task } from "../../types/task";
import { useUIStore } from "../../store/useUIStore";

interface TasksResponse {
  tasks: Task[];
  total: number;
}

export const TASKS_PER_PAGE = 10;

export const useTasks = () => {
  const filter = useUIStore((s) => s.filter);
  const page = useUIStore((s) => s.page);

  return useQuery<TasksResponse>({
    queryKey: ["tasks", filter, page],
    queryFn: async () => {
      const { data, headers } = await api.get<Task[]>("/tasks", {
        params: { _page: page, _limit: TASKS_PER_PAGE },
      });
      const total = Number(headers["x-total-count"] || data.length);
      let filtered = data;
      if (filter === "active") filtered = data.filter((t) => !t.completed);
      if (filter === "completed") filtered = data.filter((t) => t.completed);
      return { tasks: filtered, total };
    },
  });
};