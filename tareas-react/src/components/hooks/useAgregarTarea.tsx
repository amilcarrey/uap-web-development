import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNotificacionesStore } from "../store/useNotificacionesStore";

export function useAgregarTarea(tableroId: string) {
  const queryClient = useQueryClient();
  const agregarNotificacion = useNotificacionesStore((s) => s.agregar);

  return useMutation({
    mutationFn: (texto: string) =>
      axios.post("http://localhost:8008/tareas", {
        id: crypto.randomUUID(),
        texto,
        completada: false,
        fecha_creacion: new Date().toISOString(),
        fecha_modificacion: new Date().toISOString(),
        fecha_realizada: null,
        tableroId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      agregarNotificacion("Tarea agregada", "success");
    },
    onError: () => {
      agregarNotificacion("Error al agregar tarea", "error");
    },
  });
}
