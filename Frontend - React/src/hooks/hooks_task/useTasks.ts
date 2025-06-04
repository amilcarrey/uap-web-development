import { useQuery } from '@tanstack/react-query'; 
import { API_URL } from "../../components/TaskManager";

export function useTasks(
  filter: string,
  page: number,
  limit: number,
  tableroId: number | null,
  refetchInterval: number
) {
  return useQuery({
    queryKey: ['tasks', filter, page, limit, tableroId],
    queryFn: async () => {
      console.log("✅ Se ejecutó el query de tareas");

      const params = new URLSearchParams({
        filter,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (tableroId !== null) {
        params.append('tableroId', tableroId.toString());
      }

      const res = await fetch(`${API_URL}/api/tareas/getFiltered?${params.toString()}`);
      if (!res.ok) throw new Error('Error al obtener las tareas');

      const data = await res.json();
      console.log("Tareas recibidas:", data);

      return {
        data: data.data ?? [],
        totalPages: data.totalPages ?? 1,
      };
    },
    enabled: tableroId !== null, // Solo se ejecuta si hay un tablero seleccionado
    refetchInterval: tableroId !== null ? refetchInterval : false
  });
}
