// src/hooks/useDeleteTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from '../store/toastStore';

const BASE_URL = "http://localhost:4321/api";

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`${BASE_URL}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Error al eliminar recordatorio");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
       useToastStore.getState().addToast({
      message: "Tarea eliminada",
      type: "success",
    });
    },
    onError: () => {
      useToastStore.getState().addToast({
        message: "Error al eliminar la tarea",
        type: "error",
      });
    },
  });
}

