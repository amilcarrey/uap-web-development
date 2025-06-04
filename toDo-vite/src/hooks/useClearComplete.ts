import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";


export function useClearComplete() {
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE_URL}/clear-completed`, {
        method: "POST",
        body: JSON.stringify({action: "clearCompleted"}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al limpiar tareas completadas");
      return response.json(); 
    },
    onSuccess: () => {
      console.log("Tareas completadas eliminadas exitosamente");
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}