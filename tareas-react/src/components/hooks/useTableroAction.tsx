import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type TableroAction =
  | { type: "create"; nombre: string }
  | { type: "delete"; id: string };

export function useTableroAction(notificar?: (msg: string, tipo?: string) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: TableroAction) => {
      switch (action.type) {
        case "create":
          return axios.post(
            "http://localhost:8008/api/tableros",
            { nombre: action.nombre },
            { withCredentials: true }
          );
        case "delete":
          return axios.delete(
            `http://localhost:8008/api/tableros/${action.id}`,
            { withCredentials: true }
          );
      }
    },
    onSuccess: (_data, action) => {
      if (notificar) {
        if (action.type === "create") notificar("Tablero creado", "success");
        if (action.type === "delete") notificar("Tablero eliminado", "error");
      }
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
    },
    onError: (_err, action) => {
      if (notificar) {
        if (action.type === "create") notificar("Error al crear tablero", "error");
        if (action.type === "delete") notificar("Error al eliminar tablero", "error");
      }
    },
  });
}