import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";


export function useCompleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_URL}/tasks/${id}/complete`, {
        method: "PATCH",
        credentials: 'include',
        body: JSON.stringify({completed: true}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al completar tarea");
      if (response.status === 204) {
        return true; 
      }
      return response.json(); 
    },
    onSuccess: () => {
      console.log("Tarea completada exitosamente");
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}