import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Task } from '../types/Task';

export function useTasks(boardId: string, page: number = 1, search: string = '') {
  const queryKey = ['tasks', boardId, page, search];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get(`/boards/${boardId}/tasks`, {
        params: { page, search }
      });
      return data as { tasks: Task[]; total: number };
    },
    enabled: !!boardId
  });

  return {
    tasks: query.data?.tasks || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch
  };
}
