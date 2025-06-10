import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../store/toastStore";

export const useBorrarTarea = (tableroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
    },
  });
};


//VER ERRORES AHORA
