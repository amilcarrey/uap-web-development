import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tarea } from "../types";
import { useToastStore } from "../store/toastStore";

export const useEditarTarea = () => {
  const queryClient = useQueryClient();
  const agregarToast = useToastStore((s) => s.agregarToast);

  return useMutation({
    mutationFn: async (tarea: Tarea) => {
      const res = await fetch(`http://localhost:3000/tasks/${tarea.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarea),
      });
      if (!res.ok) throw new Error("Error al editar tarea");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      agregarToast("Tarea editada con éxito", "exito");
    },
    onError: () => {
      agregarToast("Error al editar tarea", "error");
    },
  });
};
