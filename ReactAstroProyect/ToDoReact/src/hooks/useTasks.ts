import { useQuery } from "@tanstack/react-query";
import type { Task } from "../types";
import { useSettingsStore } from "../store/settingsStore";

const API_URL = import.meta.env.VITE_API_URL;

  type TasksResponse = 
  {
    tasks: Task[];
    totalPages: number;
    totalCount: number;
  };

  export function useTasks(filtro?: "completadas" | "pendientes", page = 1, pageSize = 7, categoriaId?: string, search?: string) {
    // usamos configuraciones del store
  const { refetchInterval, tasksPerPage } = useSettingsStore();
  const finalPageSize = tasksPerPage;

    return useQuery<TasksResponse>({
    queryKey: ["tasks", filtro, categoriaId, page, pageSize, search],
    queryFn: async () => {
      // CONSTRUIR URL, sabemos que el back maneja los args como query params opcionales
      // Solo agregamos los parámetros que existen 
      const params = new URLSearchParams();
      if (filtro) params.append("filtro", filtro);        // Solo agregar si existe
      if (categoriaId) params.append("categoriaId", categoriaId);               // Solo si existe
      params.append("page", page.toString());                                   // Siempre presente  
      params.append("pageSize", finalPageSize.toString());                       // Siempre presente y la que definimos en settings
      if (search) params.append("search", search);                              // Solo  si existe

      const res = await fetch(`${API_URL}/api/tasks?${params.toString()}`, {
        credentials: 'include', //  enviar cookies JWT
        headers: {
          'Content-Type': 'application/json',
        },
      });

      //  ERROR DE aut
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login';
          throw new Error('No autenticado');
        }
        throw new Error("Error al cargar tareas");
      }
      return res.json();
    },
    refetchInterval: refetchInterval * 1000, // tambien definido en settings
  });
}