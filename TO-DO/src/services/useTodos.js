// src/services/useTodos.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:3000/api/todos';

export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar tareas');
      return res.json();
    },
  });
}

export function useAddTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todo) => {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
      if (!res.ok) throw new Error('Error al agregar tarea');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(['todos']),
  });
}

export function useDeleteTodo() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id) => {
        const res = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar tarea');
        return res.json();
      },
      onSuccess: () => queryClient.invalidateQueries(['todos']),
    });
  }
