import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import type { Task } from '../types/Task';

const TASKS_ENDPOINT = 'http://localhost:3000/tasks';

export const useAddTask = () => {
  const queryClient = useQueryClient();
  const { boardId = '' } = useParams();

  return useMutation({
    mutationFn: async (text: string) => {
      const response = await axios.post<Task>(TASKS_ENDPOINT, {
        text,
        completed: false,
        boardId,
      });

      return response.data;
    },
    onSuccess: (_data, _text, _context) => {
      toast.success('✅ Tarea agregada');
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
    onError: (error) => {
      console.error('❌ Error al agregar tarea:', error);
      toast.error('❌ No se pudo agregar la tarea');
    },
  });
};
