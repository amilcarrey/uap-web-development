import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";


export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_URL}/delete-task`, {
        method: "POST",
        body: JSON.stringify({action: "delete", id  }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al eliminar tarea");
      return response.json(); 
    },
    onSuccess: () => {
      console.log("Tarea eliminada exitosamente");
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}