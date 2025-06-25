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
      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PATCH",
        credentials: 'include',
        body: JSON.stringify({name}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al editar la tarea");
      if (response.status === 204) {
        return true; 
      }
      return response.json(); 
    },
    onSuccess: () => {
      console.log("Tarea editada exitosamente");
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}