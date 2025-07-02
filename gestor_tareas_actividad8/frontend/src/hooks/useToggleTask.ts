import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useToggleTask(boardId: string, page: number = 1) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      api.patch(`/tasks/${id}`, { completed }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId, page] });
    }
  });
}
