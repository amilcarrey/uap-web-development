// src/hooks/useDeleteTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from '../store/toastStore';
import { useAuth } from "./useAuth";

const BASE_URL = "http://localhost:3000/api";

export function useDeleteTask() {
  const queryClient = useQueryClient();
  //const { token } = useAuth();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`${BASE_URL}/reminder/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
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

