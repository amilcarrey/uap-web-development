import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useDeleteTask(boardId: string, page: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => api.delete(`/tasks/${taskId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId, page] });
    },
  });
}
