import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

type Board = {
  id: string;
  name: string;
  taskCount: number;
};

export const useBoards = () => {
  const queryClient = useQueryClient();
  const BOARDS_ENDPOINT = 'http://localhost:3000/boards';

  const { data: boards = [], isLoading, error } = useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: async () => {
      const res = await axios.get(BOARDS_ENDPOINT);
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => axios.post(BOARDS_ENDPOINT, { name }),
    onSuccess: () => {
      toast.success('Tablero creado');
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });


const deleteMutation = useMutation({
  mutationFn: (id: string) => axios.delete(`${BOARDS_ENDPOINT}/${id}`),
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