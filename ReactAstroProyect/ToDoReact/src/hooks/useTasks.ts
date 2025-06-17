import { useQuery } from "@tanstack/react-query";
import type { Task } from "../types";
import { useSettingsStore } from "../store/settingsStore";

const API_URL = import.meta.env.VITE_API_URL;

type TasksResponse = 
{
  tasks: Task[];
  totalPages: number;
};

export function useTasks(filtro?: "completadas" | "pendientes", page = 1, pageSize = 7, categoriaId?: string) {
   console.log("Parámetros enviados a /api/tasks:", { filtro, categoriaId, page, pageSize });
  const refetchInterval = useSettingsStore((state) => state.refetchInterval);

  return useQuery<TasksResponse>({
    queryKey: ["tasks", filtro, categoriaId, page, pageSize],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/tasks?filtro=${filtro}&categoriaId=${categoriaId}&page=${page}&pageSize=${pageSize}`);
      if (!res.ok) {
        throw new Error("Error al cargar tareas");
      }
      return res.json();
    },
    refetchInterval: refetchInterval * 1000,
  });
}