import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const res = await fetch('http://localhost:4000/api/boards', { credentials: 'include' });
      if (!res.ok) throw new Error('No autorizado');
      return res.json();
    }
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
      return res.json(); // <-- Esto retorna el board creado
    },
    onSuccess: (board) => {
      queryClient.invalidateQueries(['boards']);
      // No hagas nada más aquí, el board se pasa al onSuccess del componente
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