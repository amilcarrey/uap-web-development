
import type { Task as TaskType } from "../types";
import { useQuery } from "@tanstack/react-query";
import { usePaginationStore } from "../stores/usePaginationStore";
import type { TaskFilter } from "../types";

import { useSettingsStore } from "../stores/useSettingsStore";

export const BASE_URL = "http://localhost:4321/api";


type TasksResponse = {
  tasks: TaskType[];
  totalPages: number;
};


export function useTasks(filter: TaskFilter, boardId?: string, searchQuery = '') {
  const { page } = usePaginationStore();
  const { refetchInterval, tasksPerPage } = useSettingsStore();
  const limit = tasksPerPage || 5;


  const queryKey = ["tasks", filter, page, boardId, searchQuery];

  return useQuery({
    queryKey,
    queryFn: async () => {
      let url = `${BASE_URL}/tasks/${boardId}?page=${page}&limit=${limit}`;
      if (filter !== "all") {
        url += `&filter=${filter}`;
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
     
      const res = await fetch(url,{
        credentials: 'include', 
        headers: { "Content-Type": "application/json" },
      });
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