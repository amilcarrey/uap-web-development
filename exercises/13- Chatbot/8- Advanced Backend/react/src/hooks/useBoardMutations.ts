import { useMutation, useQueryClient } from '@tanstack/react-query';
import { boardService } from '../services/boardServices';

export function useCreateBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (text: string) => {
            return await boardService.createBoard({ name: text });
        },
        onSuccess: () => {
            // ✅ Invalidar ambas queries para que se reflejen los cambios
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            queryClient.invalidateQueries({ queryKey: ['accessible-boards'] });
        }
    })
}

export function useDeleteBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (boardId: number) => {
            return await boardService.deleteBoard(boardId);
        },
        onSuccess: () => {
            // ✅ Invalidar ambas queries para que se reflejen los cambios
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            queryClient.invalidateQueries({ queryKey: ['accessible-boards'] });
        }
    })
}

export function useEditBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ boardId, text }: { boardId: number; text: string }) => {
            return await boardService.updateBoard(boardId, { name: text });
        },
        onSuccess: () => {
            // ✅ Invalidar ambas queries para que se reflejen los cambios
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            queryClient.invalidateQueries({ queryKey: ['accessible-boards'] });
        }
    })
}