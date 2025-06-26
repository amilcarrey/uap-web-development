import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from '../store/toastStore';

const BASE_URL = "http://localhost:3000/api";

// interface AddTaskVariables {
//   name: string;
//   boardId: string;
//   compleated: boolean;
// }

export function useAddTask(boardId: string) {
  const queryClient = useQueryClient();
 // const { token} = useAuth();

  return useMutation({
    mutationFn: async (data: { name: string; board_id: string }) => {
      // //if (!token) throw new Error("Usuario no autenticado");

      const res = await fetch(`${BASE_URL}/reminder/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
         
        },
        body: JSON.stringify({
          name: data.name,
          board_id: boardId,
          completed: false,
          
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorData: { message?: string; error?: string } = {};
        
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error("Could not parse error as JSON:", e);
        }

        // Manejar diferentes tipos de errores
        if (res.status === 403) {
          throw new Error("No tienes permisos para agregar tareas a este tablero");
        } else if (res.status === 401) {
          throw new Error("Debes iniciar sesión para realizar esta acción");
        } else if (res.status === 404) {
          throw new Error("El tablero no existe o no tienes acceso");
        }
        
        throw new Error(errorData.error || errorData.message || "Error al agregar tarea");
      }

      return res.json();
    },
    onSuccess: () => {
      // Opcional: actualiza la cache de tasks del board
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      useToastStore.getState().showToast("Tarea agregada correctamente", "success");
    },
    onError: (error: any) => {
      useToastStore.getState().showToast(error.message || "Error al agregar tarea", "error");
    }
  });
}