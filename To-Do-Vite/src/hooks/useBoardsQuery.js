import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBoards, createBoard, deleteBoard } from '../config/api';
import useAppStore from '../stores/appStore';

export function useBoardsQuery() {
  const queryClient = useQueryClient();
  const refetchInterval = useAppStore((state) => state.settings.refetchInterval) || 30;

  // Obtener tableros
  const boardsQuery = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
    staleTime: refetchInterval * 1000, // Usar configuración del store
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval * 1000, // Refetch automático
  });

  // Crear tablero
  const createBoardMutation = useMutation({
    mutationFn: ({ name, category }) => createBoard(name, category),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
  });

  // Eliminar tablero
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