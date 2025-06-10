// src/hooks/useBoards.js
import axios from 'axios';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { BOARDS_URL } from '../api/endpoints';
import { toast } from 'react-toastify';

/**
 * useQuery en v5 espera un único objeto con { queryKey, queryFn, ...opciones }.
 */
export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const { data } = await axios.get(BOARDS_URL);
      return data;
    },
    onError: (err) => {
      toast.error('Error al cargar tableros');
      console.error(err);
    },
    // Opcionalmente podrías agregar staleTime, etc.
    // staleTime: 1000 * 60 * 2, // 2 minutos, por ejemplo
  });
}

/**
 * useMutation en v5 también usa un objeto:
 *  - mutationFn, onSuccess, onError, etc.
 */
export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name) => {
      const { data } = await axios.post(BOARDS_URL, { name });
      return data;
    },
    onSuccess: (newBoard) => {
      toast.success(`Tablero "${newBoard.name}" creado`);
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: (err) => {
      toast.error('Error al crear tablero');
      console.error(err);
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (boardId) => {
      await axios.delete(`${BOARDS_URL}/${boardId}`);
      return boardId;
    },
    onSuccess: () => {
      toast.success('Tablero eliminado');
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: (err) => {
      toast.error('Error al eliminar tablero');
      console.error(err);
    },
  });
}
