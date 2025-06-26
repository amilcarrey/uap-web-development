import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type TareaAction =
  | { type: "add"; tableroId: string; texto: string }
  | { type: "update"; id: string; data: Partial<{ texto: string; completada: boolean }> }
  | { type: "delete"; id: string; tableroId?: string }
  | { type: "toggle"; id: string; estadoActual: boolean };

export function useTareaAction(notificar?: (msg: string, tipo?: string) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: TareaAction) => {
      switch (action.type) {
        case "add":
          return axios.post(
            "http://localhost:8008/api/tareas",
            { texto: action.texto, tableroId: action.tableroId },
            { withCredentials: true }
          );
        case "update":
          return axios.patch(
            `http://localhost:8008/api/tareas/${action.id}`,
            { ...action.data, fecha_modificacion: new Date().toISOString() },
            { withCredentials: true }
          );
        case "delete":
          return axios.delete(
            `http://localhost:8008/api/tareas/${action.id}`,
            { withCredentials: true }
          );
        case "toggle":
          const ahora = new Date().toISOString();
          return axios.patch(
            `http://localhost:8008/api/tareas/${action.id}/completar`,
            {
              completada: !action.estadoActual,
              fecha_modificacion: ahora,
              fecha_realizada: !action.estadoActual ? ahora : null,
            },
            { withCredentials: true }
          );
      }
    },
    onSuccess: (_data, action) => {
      if (notificar) {
        if (action.type === "add") notificar("Tarea agregada", "success");
        if (action.type === "update") notificar("Tarea actualizada", "success");
        if (action.type === "delete") notificar("Tarea eliminada", "error");
        if (action.type === "toggle") notificar("Tarea actualizada", "success");
      }
      // Invalida queries relevantes según la acción
      if ("tableroId" in action && action.tableroId) {
        queryClient.invalidateQueries({ queryKey: ["tareas", action.tableroId] });
      } else if ("id" in action) {
        queryClient.invalidateQueries({ queryKey: ["tarea", action.id] });
        queryClient.invalidateQueries({ queryKey: ["tareas"] });
      }
    },
    onError: (_err, action) => {
      if (notificar) {
        if (action.type === "add") notificar("Error al agregar tarea", "error");
        if (action.type === "update") notificar("Error al actualizar tarea", "error");
        if (action.type === "delete") notificar("Error al eliminar tarea", "error");
        if (action.type === "toggle") notificar("Error al actualizar tarea", "error");
      }
    },
  });
}