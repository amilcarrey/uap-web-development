// src/hooks/useClearCompleted.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from '../store/toastStore';

const BASE_URL = "http://localhost:4321/api";

export function useClearCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BASE_URL}/clear`, { method: "POST" });
      if (!res.ok) throw new Error("Error al limpiar completados");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
       useToastStore.getState().addToast({
      message: "Tareas completadas eliminadas",
      type: "success",
    });
    },
    onError: () => {
      useToastStore.getState().addToast({
        message: "Error al limpiar las tareas completadas",
        type: "error",
      });
    },
  });
}
