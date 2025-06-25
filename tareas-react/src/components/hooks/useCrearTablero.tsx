import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNotificacionesStore } from "../store/useNotificacionesStore";

export function useCrearTablero() {
  const queryClient = useQueryClient();
  const notificar = useNotificacionesStore((s) => s.agregar);

  return useMutation({
    mutationFn: async (nombre: string) => {
      if (!nombre.trim()) return;
      await axios.post(
        "http://localhost:8008/api/tableros",
        { nombre },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
      notificar("Tablero creado", "success");
    },
    onError: () => {
      notificar("Error al crear el tablero", "error");
    },
  });
}