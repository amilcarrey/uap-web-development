import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";

type EditTaskParams = {
  id: string;
  name: string;
};


export function useEditTask() {
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: async ({ id, name }: EditTaskParams)  => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await fetch(`${BASE_URL}/edit-task`, {
        method: "POST",
        body: JSON.stringify({action: "edit", id, name}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al editar la tarea");
      return response.json(); 
    },
    onSuccess: () => {
      console.log("Tarea editada exitosamente");
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}