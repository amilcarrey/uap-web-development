// src/hooks/useDeleteBoard.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from '../store/toastStore';

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  //const { token } = useAuth();

  return useMutation({
    mutationFn: async (boardId: string) => {
      const res = await fetch(`http://localhost:3000/api/board/${boardId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Manejar diferentes tipos de errores
        if (res.status === 403) {
          throw new Error("No tienes permisos para eliminar este tablero");
        } else if (res.status === 401) {
          throw new Error("Debes iniciar sesión para realizar esta acción");
        } else if (res.status === 404) {
          throw new Error("El tablero no existe o no tienes acceso");
        }
        
        throw new Error("Error al eliminar el tablero");
      }

      try {
        return await res.json();
      } catch {
        return true;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"]});
      useToastStore.getState().showToast("Tablero eliminado correctamente", "success");
    },
    onError: (error: any) => {
      useToastStore.getState().showToast(error.message || "Error al eliminar el tablero", "error");
    },
  });
}