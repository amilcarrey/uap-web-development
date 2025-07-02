import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useUpdateTask(boardId: string, page: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      api.patch(`/tasks/${id}`, { text }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', boardId, page]
      });
    }
  });
}
