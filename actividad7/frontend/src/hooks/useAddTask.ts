import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import type { Task } from '../types/Task';

const TASKS_ENDPOINT = 'http://localhost:3000/tasks';

export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      const response = await axios.post<Task>(TASKS_ENDPOINT, {
        text,
        completed: false,
      });

      return {
        ...response.data,
        id: typeof response.data.id === 'string'
          ? parseInt(response.data.id, 10)
          : response.data.id,
      };
    },
    onSuccess: () => {
      toast.success('✅ Tarea agregada correctamente');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('❌ Error al agregar tarea:', error);
      toast.error('❌ Error al agregar tarea');
    },
  });
};
