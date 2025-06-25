import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";


export function useClearComplete() {
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: async (boardId: string) => {
      const response = await fetch(`${BASE_URL}/tasks/${boardId}/clear-completed`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al limpiar tareas completadas");
      if (response.status === 204) {
        return true;
      }
      return response.json(); 
    },
    onSuccess: () => {
      console.log("Tareas completadas eliminadas exitosamente");
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}