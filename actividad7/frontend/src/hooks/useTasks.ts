import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import type { Task } from '../types/Task';

const TASKS_ENDPOINT = 'http://localhost:3000/tasks';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { data = [], isLoading, isError } = useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const res = await axios.get<Task[]>(TASKS_ENDPOINT);
        return res.data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
    },
  });

  // ✅ Toggle completed
  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const response = await axios.patch(`${TASKS_ENDPOINT}/${id}`, { completed });
      return response.data;
    },
    onSuccess: () => {
      toast.success('✅ Tarea actualizada');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('❌ Error al actualizar tarea:', error);
      toast.error('❌ Error al actualizar tarea');
    },
  });

  // ✅ Delete task
  const deleteMutation = useMutation({
    mutationFn: (id: number) => axios.delete(`${TASKS_ENDPOINT}/${id}`),
    onSuccess: () => {
      toast.success('🗑️ Tarea eliminada');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('❌ Error al eliminar tarea:', error);
      toast.error('❌ No se pudo eliminar la tarea');
    },
  });

  // ✅ Clear completed
  const clearMutation = useMutation({
    mutationFn: async () => {
      const completedTasks = data.filter(task => task.completed);
      await Promise.all(
        completedTasks.map(task =>
          axios.delete(`${TASKS_ENDPOINT}/${task.id}`).catch(error => {
            console.error(`Error deleting task ${task.id}:`, error);
            throw error;
          })
        )
      );
    },
    onSuccess: () => {
      toast.success('🧹 Tareas completadas eliminadas');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('❌ Error al limpiar tareas completadas:', error);
      toast.error('❌ No se pudieron eliminar las tareas completadas');
    },
  });

  return {
    data,
    isLoading,
    isError,
    toggleTask: (id: number, completed: boolean) => toggleMutation.mutate({ id, completed }),
    deleteTask: (id: number) => deleteMutation.mutate(id),
    clearCompleted: () => {
      if (data.some(task => task.completed)) {
        clearMutation.mutate();
      }
    },
  };
};
