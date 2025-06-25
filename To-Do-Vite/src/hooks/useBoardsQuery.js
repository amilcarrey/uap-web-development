import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBoards, createBoard, deleteBoard } from '../config/api';
import { useUserSettings } from './useSettings';

export function useBoardsQuery() {
  const queryClient = useQueryClient();
  const { data: settings = {} } = useUserSettings();
  const refetchInterval = settings.refetch_interval || 30;

  // Obtener tableros
  const boardsQuery = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
    staleTime: refetchInterval * 1000, 
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval * 1000,
  });

  const createBoardMutation = useMutation({
    mutationFn: ({ name, category }) => createBoard(name, category),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (boardName) => deleteBoard(boardName),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
  });

  return {
    boardsQuery,
    createBoardMutation,
    deleteBoardMutation,
  };
} 