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
        const error = await res.json();
        throw new Error(error?.error || "Error al agregar tarea");
      }

      return res.json();
    },
    onSuccess: () => {
      // Opcional: actualiza la cache de tasks del board
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      useToastStore.getState().showToast("Tarea agregada correctamente");
    },
    onError: (error: any) => {
      useToastStore.getState().showToast(error.message || "Error al agregar tarea");
    }
  });
}