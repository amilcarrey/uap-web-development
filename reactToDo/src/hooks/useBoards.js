import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useBoards() {
  return useQuery(['boards'], async () => {
    const res = await fetch('http://localhost:4000/api/boards', { credentials: 'include' });
    if (!res.ok) throw new Error('No autorizado');
    return res.json();
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name) => {
      const res = await fetch('http://localhost:4000/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Error al crear board');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`http://localhost:4000/api/boards/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al borrar board');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
  });
}