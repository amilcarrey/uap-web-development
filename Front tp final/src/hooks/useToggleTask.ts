// src/hooks/useToggleTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from '../store/toastStore';
import { useAuth } from "./useAuth";

const BASE_URL = "http://localhost:3000/api";

export function useToggleTask() {
  const queryClient = useQueryClient();
 // const { token } = useAuth();

  return useMutation<void, Error, { id: string, boardId: string }>({
    mutationFn: async ({ id, boardId }) => {
      const res = await fetch(`${BASE_URL}/reminder/${id}/toggle`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, boardId }),
      });
      if (!res.ok) throw new Error("Error al cambiar el estado del recordatorio");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      useToastStore.getState().addToast({
        message: "Estado de tarea actualizado",
        type: "info",
      });
    },
    onError: () => {
      useToastStore.getState().addToast({
        message: "Error al actualizar el estado de la tarea",
        type: "error",
      });
    },
  });
}
