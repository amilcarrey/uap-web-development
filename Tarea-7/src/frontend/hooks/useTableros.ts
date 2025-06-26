import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Tablero {
  id: string;
  nombre: string;
}

export function useTableros() {
  return useQuery<Tablero[], Error>({
    queryKey: ['tableros'],
    queryFn: () => axios.get('/api/tableros').then(res => res.data),
  });
}

export function useCrearTablero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nuevoTablero: { nombre: string }) =>
      axios.post('/api/tableros', nuevoTablero).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
  });
}

export function useEditarTablero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, nombre }: { id: string; nombre: string }) =>
      axios.put(`/api/tableros/${id}`, { nombre }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
  });
}

export function useEliminarTablero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/api/tableros/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
  });
}
