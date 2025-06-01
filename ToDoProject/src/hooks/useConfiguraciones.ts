import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Configuraciones {
  intervaloRefetch: number;
  descripcionMayusculas: boolean;
}

// Hook para obtener configuraciones
export const useConfiguraciones = () => {
  return useQuery<{ configuraciones: Configuraciones }>({
    queryKey: ['configuraciones'],
    queryFn: async () => {
      const response = await fetch('http://localhost:4321/api/configuraciones');
      if (!response.ok) throw new Error('Error al obtener configuraciones');
      return response.json();
    },
  });
};

// Hook para actualizar configuraciones
export const useActualizarConfiguraciones = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (configuraciones: Partial<Configuraciones>) => {
      const response = await fetch('http://localhost:4321/api/configuraciones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configuraciones),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar configuraciones');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuraciones'] });
    },
  });
};

// Hook para resetear configuraciones
export const useResetearConfiguraciones = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await fetch('http://localhost:4321/api/configuraciones', {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Error al resetear configuraciones');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuraciones'] });
    },
  });
};