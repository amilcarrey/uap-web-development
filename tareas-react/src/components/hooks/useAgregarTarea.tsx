import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNotificacionesStore } from "../store/useNotificacionesStore";

export function useAgregarTarea(tableroId: string) {
  const queryClient = useQueryClient();
  const agregarNotificacion = useNotificacionesStore((s) => s.agregar);

  console.log("tableroId actual:", tableroId);

  return useMutation({
    mutationFn: (descripcion: string) =>
      axios.post("http://localhost:8008/api/tareas", {
        texto: descripcion,
        tableroId: tableroId,
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