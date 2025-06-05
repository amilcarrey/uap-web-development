import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Tablero {
  id: string;
  nombre: string;
  alias: string;
}

interface TablerosResponse {
  tableros: Tablero[];
}

// Hook para obtener todos los tableros
export const useTableros = () => {
  return useQuery<TablerosResponse>({
    queryKey: ['tableros'],
    queryFn: async () => {
      const response = await fetch('http://localhost:4321/api/tableros');
      if (!response.ok) throw new Error('Error al obtener tableros');
      return response.json();
    },
  });
};

// Hook para crear un nuevo tablero
export const useCrearTablero = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ nombre, alias }: { nombre: string; alias: string }) => {
      const response = await fetch('http://localhost:4321/api/agregarTablero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, alias }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear tablero');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
  });
};

// Hook para eliminar tablero
export const useEliminarTablero = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alias: string) => {
      const response = await fetch(`http://localhost:4321/api/eliminarTablero`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alias }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar tablero');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
      queryClient.invalidateQueries({ queryKey: ['tablero'] });
    },
  });
};

// Hook para obtener un tablero específico por alias
export const useTablero = (alias: string) => {
  return useQuery({
    queryKey: ['tablero', alias],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4321/api/tablero/${alias}`);
      if (!response.ok) throw new Error('Error al obtener tablero');
      return response.json();
    },
    enabled: !!alias,
  });
};