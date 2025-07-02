import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { taskApi } from '../services/taskApi';

export const useAddTask = () => {
  const queryClient = useQueryClient();
  const { boardId = '' } = useParams();

  return useMutation({
    mutationFn: async (text: string) => {
      const { data } = await taskApi.add(text, boardId);
      return data;
    },
    onSuccess: () => {
      toast.success('✅ Tarea agregada');
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
    onError: (error) => {
      console.error('❌ Error al agregar tarea:', error);
      toast.error('❌ No se pudo agregar la tarea');
    },
  });
};
