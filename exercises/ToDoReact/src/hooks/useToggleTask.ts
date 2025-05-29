import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../lib/tasks"; // Nota el 'type' aquí

const API_URL = import.meta.env.VITE_API_URL;

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _method: "TOGGLE", id }),
      });
      if (!res.ok) throw new Error("No se pudo cambiar el estado de la tarea");
      return res.json(); // No necesitas el tipo aquí si el backend devuelve la tarea completa
    },

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      // Actualización optimista
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => 
        old?.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      
      return { previousTasks };
    },

    onError: (error, { id }, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },

    onSuccess: () => { // Tipo explícito para la respuesta
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}