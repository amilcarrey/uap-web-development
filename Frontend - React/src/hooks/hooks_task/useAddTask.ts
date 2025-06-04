import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";
import type { Task } from '../../types';

// Nuevo tipo de parámetros para la tarea
type NuevaTareaPayload = {
  descripcion: string;
  tableroId: number;
};

export function useAddTask(): UseMutationResult<Task, Error, NuevaTareaPayload> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ descripcion, tableroId }) => {
      const res = await fetch(`${API_URL}/api/tareas/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, tableroId }),
      });

      if (!res.ok) {
        throw new Error('No se pudo crear la tarea');
      }

      const data = await res.json();
      return data.task as Task;
    },

    onSuccess: (newTask) => {
      console.log("✅ Tarea agregada con éxito:", newTask);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
