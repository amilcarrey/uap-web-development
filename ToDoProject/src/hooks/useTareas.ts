import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TareaType } from '../types/Tarea';

export interface PaginatedResponse {
  tareas: TareaType[];
  totalPaginas: number;
  paginaActual: number;
  totalTareas: number;
}

export const useTareasQuery = (
  pagina: number = 1,
  filtro: 'todas' | 'completadas' | 'pendientes' = 'todas',
  limite: number = 5
) => {
  return useQuery<PaginatedResponse>({
    queryKey: ['tareas', pagina, filtro, limite],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:4321/api/tareas?pagina=${pagina}&filtro=${filtro}&limite=${limite}`
      );
      if (!res.ok) throw new Error('Error al cargar tareas');
      return res.json();
    },
  });
};

export const useEliminarTareaMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch('http://localhost:4321/api/eliminar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Error al eliminar tarea');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });
};

export const useToggleTareaMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch('http://localhost:4321/api/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ id: id.toString() }),
      });
      if (!res.ok) throw new Error('Error al cambiar estado');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });
};

export const useEditarTareaMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, descripcion }: { id: number; descripcion: string }) => {
      const res = await fetch('http://localhost:4321/api/editar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, descripcion }),
      });
      if (!res.ok) throw new Error('Error al editar tarea');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });
};