// src/hooks/useToggleTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from '../store/toastStore';

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
      
      if (!res.ok) {
        // Manejar diferentes tipos de errores
        if (res.status === 403) {
          throw new Error("No tienes permisos para modificar esta tarea");
        } else if (res.status === 401) {
          throw new Error("Debes iniciar sesión para realizar esta acción");
        } else if (res.status === 404) {
          throw new Error("La tarea no existe o no tienes acceso");
        }
        
        throw new Error("Error al cambiar el estado del recordatorio");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      useToastStore.getState().showToast("Estado de tarea actualizado", "info");
    },
    onError: (error: any) => {
      useToastStore.getState().showToast(error.message || "Error al actualizar el estado de la tarea", "error");
    },
  });
}
