import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNotificacionesStore } from "../store/useNotificacionesStore";
import { useNavigate } from "@tanstack/react-router";

export function useDeleteTablero(tableros: { id: string }[]) {
  const queryClient = useQueryClient();
  const notificar = useNotificacionesStore((s) => s.agregar);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:8008/api/tableros/${id}`, { withCredentials: true });
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
      // Redirigir al tablero anterior o siguiente
      const idx = tableros.findIndex((t) => t.id === id);
      let nuevoIdx: number | null = null;
      if (idx > 0) {
        nuevoIdx = idx - 1;
      } else if (tableros.length > 1) {
        nuevoIdx = 1;
      }
      if (nuevoIdx !== null && tableros[nuevoIdx]) {
        navigate({ to: `/tablero/${tableros[nuevoIdx].id}` });
      } else {
        navigate({ to: "/" });
      }
      notificar("Tablero eliminado", "error");
    },
    onError: () => {
      notificar("Error al eliminar el tablero", "error");
    },
  });
}