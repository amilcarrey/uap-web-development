import type { Task } from "../types";
import { useQuery } from "@tanstack/react-query";

export type TaskFilter = "all" | "completed" | "incomplete";
export const BASE_URL = "http://localhost:4321/api";

type UseTasksResult = {
  tasks: Task[];
  total: number;
}

export function useTasks(filter: TaskFilter, page: number, limit = 5) { //np se si es string o all, completed y incomplete
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
    staleTime: 0, // 1 minute
  });
}