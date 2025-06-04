
import type { Task as TaskType } from "../types";
import { useQuery } from "@tanstack/react-query";
import { usePaginationStore } from "../stores/usePaginationStore";
import type { TaskFilter } from "../types";

import { useSettingsStore } from "../stores/useSettingsStore";

export const BASE_URL = "http://localhost:4321/api";


type TasksResponse = {
  tasks: TaskType[];
  total: number;
  page: number;
  totalPages: number;
};


export function useTasks(filter: TaskFilter, boardId?: string) {
  const { page } = usePaginationStore();
  const limit = 5;
  const { refetchInterval } = useSettingsStore();


  const queryKey = ["tasks", filter, page, boardId];

  return useQuery({
    queryKey,
    queryFn: async () => {
      let url = `${BASE_URL}/tasks?page=${page}&limit=${limit}`;
      if (filter !== "all") {
        url += `&filter=${filter}`;
      }
      if (boardId) {
        url += `&boardId=${boardId}`;
      }
      const res = await fetch(url);
      if (!res.ok) {
          throw new Error(`Error al obtener tareas: ${res.status}`);
        }
      const data: TasksResponse = await res.json();
      console.log(data)
      return data;
    },
     refetchInterval,
    
  
  });
}