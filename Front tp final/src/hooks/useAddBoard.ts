// hooks/useCreateBoard.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from '../store/toastStore';
//import { useAuth } from "./useAuth";  

export function useCreateBoard() {
  const queryClient = useQueryClient();
  //const { token } = useAuth();

//console.log("Token usado en createBoard:", token);


  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("http://localhost:3000/api/board/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      

      });
      
      if (!res.ok) {
        // Manejar diferentes tipos de errores
        if (res.status === 403) {
          throw new Error("No tienes permisos para crear tableros");
        } else if (res.status === 401) {
          throw new Error("Debes iniciar sesión para realizar esta acción");
        }
        
        throw new Error("Error al crear el tablero");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      useToastStore.getState().showToast("Tablero creado correctamente", "success");
    },
    onError: (error: any) => {
      useToastStore.getState().showToast(error.message || "Error al crear el tablero", "error");
    },
  });
}
