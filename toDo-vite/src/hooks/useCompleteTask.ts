import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";


export function useCompleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_URL}/complete-task`, {
        method: "POST",
        body: JSON.stringify({action: "complete", id  }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al completar tarea");
      return response.json(); 
    },
    onSuccess: () => {
      console.log("Tarea completada exitosamente");
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}