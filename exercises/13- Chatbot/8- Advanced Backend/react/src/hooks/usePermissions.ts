import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { permissionsService } from '../services/permissionsService';
import { type ShareBoardData } from '../types';
import { useAppDispatch } from '../store/hooks';
import { addNotification } from '../store/uiSlice';

/**
 * Hook para obtener permisos de un tablero
 */
export function useBoardPermissions(boardId: number) {
    return useQuery({
        queryKey: ['board-permissions', boardId],
        queryFn: () => permissionsService.getBoardPermissions(boardId),
        enabled: !!boardId
    });
}

/**
 * Hook para obtener tableros accesibles (propios y compartidos)
 */
export function useAccessibleBoards() {
    return useQuery({
        queryKey: ['accessible-boards'],
        queryFn: () => permissionsService.getAccessibleBoards()
    });
}

/**
 * Hook para compartir un tablero
 */
export function useShareBoardMutation() {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: (data: ShareBoardData) => permissionsService.shareBoard(data),
        onSuccess: (_, variables) => {
            // Invalidar permisos del tablero específico
            queryClient.invalidateQueries({ queryKey: ['board-permissions', variables.board_id] });
            // Invalidar lista de tableros accesibles
            queryClient.invalidateQueries({ queryKey: ['accessible-boards'] });
            
            dispatch(addNotification({
                message: `Board shared with ${variables.user_email} as ${variables.permission_level}`,
                type: 'success'
            }));
        },
        onError: (error: any) => {
            dispatch(addNotification({
                message: `Failed to share board: ${error.message}`,
                type: 'error'
            }));
        }
    });
}

/**
 * Hook para actualizar permisos de un usuario en un tablero
 */
export function useUpdatePermissionMutation() {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: ({ boardId, userId, permission_level }: {
            boardId: number;
            userId: number;
            permission_level: 'editor' | 'viewer';
        }) => permissionsService.updateBoardPermission(boardId, userId, permission_level),
        onSuccess: (_, variables) => {
            // Invalidar permisos del tablero específico
            queryClient.invalidateQueries({ queryKey: ['board-permissions', variables.boardId] });
            // Invalidar lista de tableros accesibles (por si cambian los permisos del usuario actual)
            queryClient.invalidateQueries({ queryKey: ['accessible-boards'] });
            
            dispatch(addNotification({
                message: `Permission updated to ${variables.permission_level}`,
                type: 'success'
            }));
        },
        onError: (error: any) => {
            dispatch(addNotification({
                message: `Failed to update permission: ${error.message}`,
                type: 'error'
            }));
        }
    });
}

/**
 * Hook para remover permisos de un usuario en un tablero
 */
export function useRemovePermissionMutation() {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: ({ boardId, userId }: { boardId: number; userId: number }) =>
            permissionsService.removeBoardPermission(boardId, userId),
        onSuccess: (_, variables) => {
            // Invalidar permisos del tablero específico
            queryClient.invalidateQueries({ queryKey: ['board-permissions', variables.boardId] });
            // Invalidar lista de tableros accesibles
            queryClient.invalidateQueries({ queryKey: ['accessible-boards'] });
            
            dispatch(addNotification({
                message: 'User access removed from board',
                type: 'success'
            }));
        },
        onError: (error: any) => {
            dispatch(addNotification({
                message: `Failed to remove access: ${error.message}`,
                type: 'error'
            }));
        }
    });
}
