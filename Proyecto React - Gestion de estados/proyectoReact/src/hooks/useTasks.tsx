import type { Task } from "../types";
import { useQuery } from "@tanstack/react-query";

export type TaskFilter = "all" | "completed" | "incomplete";
export const BASE_URL = "http://localhost:4321/api";

export function useTasks(filter: TaskFilter) { //np se si es string o all, completed y incomplete
  const queryKey = ["tasks", filter];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/filtros?filter=${filter}`);
      const data: Task[] = await response.json();
      return data;
    },
    initialData: [],
  });
}