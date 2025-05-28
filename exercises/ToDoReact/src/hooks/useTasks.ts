import { useQuery } from "@tanstack/react-query";
import type { Task } from "../lib/tasks";

const API_URL = import.meta.env.VITE_API_URL;

type TasksResponse = {
  tasks: Task[];
  totalPages: number;
};

export function useTasks(filtro?: 'completadas' | 'pendientes', page = 1, pageSize = 5) {
  return useQuery<TasksResponse>({
    queryKey: ['tasks', filtro, page, pageSize],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/tasks?filtro=${filtro}&page=${page}&pageSize=${pageSize}`);
      if (!res.ok) throw new Error("Error al cargar tareas");
      return res.json();
    },
  });
}