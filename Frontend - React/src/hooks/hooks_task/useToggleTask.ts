import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";
import { mapFilterToBackend } from '../../components/TaskManager';
import { useTaskStore } from "../../store";
import type { Task } from '../../types';

export function useToggleTask(): UseMutationResult<Task, Error, number> {
  const queryClient = useQueryClient();
  const currentFilter = useTaskStore((state) => state.currentFilter);
  
  return useMutation<Task, Error, number>({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/api/tareas/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error('Error al actualizar tarea');
      }

      const data = await res.json();
      return data.task as Task;
    },

    onSuccess: () => {
      console.log("Estado de tarea actualizada.");
      queryClient.invalidateQueries({ queryKey: ['tasks', mapFilterToBackend(currentFilter)] });
    },
  });
}
