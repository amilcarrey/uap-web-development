import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../store/toastStore";
import { useConfigStore } from "../store/configStore";

export function useLimpiarTareas() {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  const board = useConfigStore((s) => s.board); // Obtener el board actual desde el store

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost:4321/api/limpiar", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error("Error al limpiar tareas completadas");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", board] });
      showToast("Tareas completadas eliminadas correctamente", "success");
    },
    onError: () => {
      showToast("Error al limpiar tareas completadas", "error");
    },
  });
}
