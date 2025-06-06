import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../store/toastStore";

export const useBorrarTarea = () => {
  const queryClient = useQueryClient();
  const agregarToast = useToastStore((s) => s.agregarToast);

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al borrar tarea");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      agregarToast("Tarea eliminada", "exito");
    },
    onError: () => {
      agregarToast("Error al borrar tarea", "error");
    },
  });
};
