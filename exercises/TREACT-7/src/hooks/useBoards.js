// src/hooks/useBoards.js  (React Query v5)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = 'http://localhost:4000';

export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/boards`);
      if (!res.ok) throw new Error('Error al obtener tableros');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // opcional: cuán frescos consideras los datos (5 minutos)
    keepPreviousData: false,  // opcional
  });
}

export function useAddBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name }) => {
      const res = await fetch(`${API_BASE}/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Error al crear tablero');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_BASE}/boards/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar tablero');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}
