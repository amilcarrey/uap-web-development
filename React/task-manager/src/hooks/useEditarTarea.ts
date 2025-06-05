import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Tarea } from "../types";
import { useToastStore } from "../store/toastStore";
import { useConfigStore } from "../store/configStore";

export function useEditarTarea() {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  const board = useConfigStore((s) => s.board); // Obtener el board actual desde el store
 

  return useMutation({
    mutationFn: async ({ id, texto }: { id: number; texto: string }) => {
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("texto", texto);
      formData.append("board", board); // Agregar el board al FormData

      const res = await fetch("http://localhost:4321/api/editar", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      const data = await res.json();
      if (!data.success) throw new Error("Error al editar tarea");
      return data.tarea as Tarea;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", board] }); // Invalidar la cache de tareas para el board actual
      showToast("Tarea editada correctamente", "success");
    },
    onError: () => {
      showToast("Error al editar tarea", "error");
    },
  });
}
