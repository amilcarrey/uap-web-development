// src/hooks/useClearCompleted.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from '../store/toastStore';
import { useAuth } from "./useAuth";

const BASE_URL = "http://localhost:3000/api";

export function useClearCompleted() {
  const queryClient = useQueryClient();
    //const { token } = useAuth();

  return useMutation({
    mutationFn: async (boardId: string) => {
      const res = await fetch(`${BASE_URL}/reminder/completed/${boardId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          
        },
      });
      if (!res.ok) throw new Error("Error al limpiar completados");
    },
    onSuccess: (_data, boardId) => {
      console.log("Tareas completadas eliminadas exitosamente");
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
      useToastStore.getState().addToast({
        message: "Tareas completadas eliminadas",
        type: "success",
      });
    },
    onError: (error) => {
      console.error("Error al limpiar las tareas completadas", error);
      useToastStore.getState().addToast({
        message: "Error al limpiar las tareas completadas",
        type: "error",
      });
    },
  });
}
