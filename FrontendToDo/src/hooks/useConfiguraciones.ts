import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Configuraciones } from '../types/Tarea';

export const useConfiguraciones = () => {
  return useQuery<{ configuraciones: Configuraciones }>({
    queryKey: ['configuraciones'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/configuraciones', {
        credentials: "include"
      });
      if (!response.ok) throw new Error('Error al obtener configuraciones');
      return response.json();
    },
  });
};

export const useActualizarConfiguraciones = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (configuraciones: Partial<Configuraciones>) => {
      const response = await fetch('http://localhost:3001/api/configuraciones', {
        method: 'PUT',
        credentials: "include", 
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

export const useResetearConfiguraciones = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await fetch('http://localhost:3001/api/configuraciones/reset', {
        method: 'POST',
        credentials: "include", 
      });
      
      if (!response.ok) throw new Error('Error al resetear configuraciones');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuraciones'] });
    },
  });
};