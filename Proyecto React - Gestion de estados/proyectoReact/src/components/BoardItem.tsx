import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Board } from '../store/useBoardStore';
import { BASE_URL } from '../hooks/useTasks';
import { showToast } from '../utils/showToast';

type BoardItemProps = {
  board: Board;
};

export function BoardItem({ board }: BoardItemProps) {
  const queryClient = useQueryClient();
  const queryKey = ['boards'];
  
  const { mutate: deleteBoard } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_URL}/eliminarTablero`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

    const data: Board = await response.json();
    return data;
    },
    onMutate: (id) => {
      queryClient.setQueryData(queryKey, (oldData: Board[]) => {
        if (!oldData) return [];
        return oldData.filter((board) => board.id !== id);
      });
    },
    onError: (_, id) => {
      queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: () => {
      showToast('Board deleted successfully', 'success');
      queryClient.invalidateQueries({ queryKey });
    },
  });
  
  return (
    <button
      className="absolute -top-2 -right-2 text-red-600 font-bold cursor-pointer"
      onClick={() => deleteBoard(board.id)}
    >
      ❌
    </button>
  );
}