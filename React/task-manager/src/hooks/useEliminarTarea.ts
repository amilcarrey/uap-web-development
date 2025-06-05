import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../store/toastStore";
import { useConfigStore } from "../store/configStore";


export function useEliminarTarea() {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  const board = useConfigStore((s) => s.board); // Obtener el board actual desde el store

  return useMutation({
    mutationFn: async (id: number) => {
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("board", board); // Agregar el board al FormData

      const res = await fetch("http://localhost:4321/api/eliminar", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error("Error al eliminar la tarea");
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", board] }); // Invalidar la cache de tareas para el board actual
      showToast("Tarea eliminada correctamente", "success");
    },
    onError: () => {
      showToast("Error al eliminar tarea", "error");
    },
  });
}
