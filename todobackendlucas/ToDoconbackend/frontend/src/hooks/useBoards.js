import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardService } from '../services';

// Hook para obtener tableros
export const useBoards = () => {
  return useQuery({
    queryKey: ['boards'],
    queryFn: boardService.getBoards,
  });
};

// Hook para obtener un tablero específico
export const useBoard = (id) => {
  return useQuery({
    queryKey: ['board', id],
    queryFn: () => boardService.getBoard(id),
    enabled: !!id,
  });
};

// Hook para crear tablero
export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: boardService.createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
};

// Hook para actualizar tablero
export const useUpdateBoard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }) => boardService.updateBoard(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['board', variables.id] });
    },
  });
};

// Hook para eliminar tablero
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: boardService.deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
};

// Hook para obtener permisos de un tablero
export const useBoardPermissions = (boardId) => {
  return useQuery({
    queryKey: ['board-permissions', boardId],
    queryFn: () => boardService.getBoardPermissions(boardId),
    enabled: !!boardId,
  });
};

// Hook para compartir tablero
export const useShareBoard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ boardId, ...data }) => boardService.shareBoard(boardId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['board-permissions', variables.boardId] });
    },
  });
};

// Hook para cambiar rol de usuario
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ boardId, userId, ...data }) => 
      boardService.changeUserRole(boardId, userId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['board-permissions', variables.boardId] });
    },
  });
};

// Hook para revocar acceso
export const useRevokeAccess = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ boardId, userId }) => boardService.revokeAccess(boardId, userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['board-permissions', variables.boardId] });
    },
  });
};
