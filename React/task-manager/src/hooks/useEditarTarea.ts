import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Tarea } from "../types";
import { useToastStore } from "../store/toastStore";

export function useEditarTarea() {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
 

  return useMutation({
    mutationFn: async ({ id, texto }: { id: number; texto: string }) => {
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("texto", texto);

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
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      showToast("Tarea editada correctamente", "success");
    },
    onError: () => {
      showToast("Error al editar tarea", "error");
    },
  });
}
