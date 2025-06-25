import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";

type NewTask = {
  name: string;
  boardId?: string; 
};

export function useAddTask() {
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: async ({name,boardId}: NewTask) => {
      const response = await fetch(`${BASE_URL}/tasks/${boardId}`, {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ name}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al agregar la tarea");
      return response.json(); 
    },
    onSuccess: () => {
      console.log("Tarea agregada exitosamente");
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
       
    },
  });


}