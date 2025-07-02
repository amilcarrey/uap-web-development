import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../services/api'; // ✅ Importa la instancia con el token

type Board = {
  id: string;
  name: string;
  taskCount: number;
};

export const useBoards = () => {
  const queryClient = useQueryClient();

  const { data: boards = [], isLoading, error } = useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: async () => {
      const res = await api.get('/boards'); // ✅ Usa instancia con token
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => api.post('/boards', { name }),
    onSuccess: () => {
      toast.success('Tablero creado');
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/boards/${id}`),
    onSuccess: () => {
      toast.success('🗑️ Tablero eliminado');
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: () => {
      toast.error('❌ Error al eliminar tablero');
    }
  });

  return {
    boards,
    isLoading,
    error,
    createBoard: (name: string) => createMutation.mutate(name),
    deleteBoard: (id: string) => deleteMutation.mutate(id),
  };
};
