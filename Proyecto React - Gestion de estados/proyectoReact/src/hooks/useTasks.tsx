import type { Task } from "../types";
import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "../store/useFilterStore";

export type TaskFilter = "all" | "completed" | "incomplete";
export const BASE_URL = "http://localhost:4321/api";

type UseTasksResult = {
  tasks: Task[];
  total: number;
}

export function useTasks(page: number, limit = 5) {
  const filter = useFilterStore((state) => state.filter);
  const queryKey = ["tasks", filter, page];

  return useQuery<UseTasksResult>({
    queryKey,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate a delay
      const response = await fetch(`${BASE_URL}/filtros?filter=${filter}&page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: UseTasksResult = await response.json();
      return data;
    },
    // initialData: [],
    staleTime: 0,
  });
}