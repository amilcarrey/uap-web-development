// src/hooks/useDeleteTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from '../store/toastStore';
//import { useAuth } from "./useAuth";

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
      
      if (!res.ok) {
        // Manejar diferentes tipos de errores
        if (res.status === 403) {
          throw new Error("No tienes permisos para eliminar esta tarea");
        } else if (res.status === 401) {
          throw new Error("Debes iniciar sesión para realizar esta acción");
        } else if (res.status === 404) {
          throw new Error("La tarea no existe o no tienes acceso");
        }
        
        throw new Error("Error al eliminar recordatorio");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      useToastStore.getState().showToast("Tarea eliminada correctamente", "success");
    },
    onError: (error: any) => {
      useToastStore.getState().showToast(error.message || "Error al eliminar la tarea", "error");
    },
  });
}

