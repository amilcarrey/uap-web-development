import { useQuery } from "@tanstack/react-query";
import type { Task } from "../types";
import { useSettingsStore } from "../store/settingsStore";

const API_URL = import.meta.env.VITE_API_URL;

type TasksResponse = 
{
  tasks: Task[];
  totalPages: number;
};

export function useTasks(filtro?: "completadas" | "pendientes", page = 1, pageSize = 5, categoriaId?: string) {
  const refetchInterval = useSettingsStore((state) => state.refetchInterval);

  return useQuery<TasksResponse>({
    queryKey: ["tasks", filtro, categoriaId, page, pageSize],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/tasks?filtro=${filtro}&categoriaId=${categoriaId}&page=${page}&pageSize=${pageSize}`);
      if (!res.ok) {
          if (res.status === 404) {
          throw new Error("URL inválida: El tablero no existe");
        }
        console.error("Error al cargar tareas:", res.statusText);
        throw new Error("Error al cargar tareas");
      }
      const data = await res.json();
      console.log("Respuesta del backend:", data);
      return data; // El backend ya devuelve los datos paginados correctamente
    },
    refetchInterval: refetchInterval * 1000,
  });
}