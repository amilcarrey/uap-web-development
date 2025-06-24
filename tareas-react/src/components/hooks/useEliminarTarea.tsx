import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNotificacionesStore } from "../store/useNotificacionesStore";

export function useEliminarTarea(tableroId?: string) {
  const queryClient = useQueryClient();
  const agregarNotificacion = useNotificacionesStore((s) => s.agregar);

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:8008/tareas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      agregarNotificacion("Tarea eliminada", "error");
    },
    onError: () => {
      agregarNotificacion("Error al eliminar tarea", "error");
    },
  });
}