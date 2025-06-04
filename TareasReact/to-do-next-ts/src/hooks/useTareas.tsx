import { useQuery } from '@tanstack/react-query';
import { useConfigStore } from '@/stores/configStore';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const useTareas = (
  filtro: string,
  pagina: number,
  tableroId: string | null
) => {
  const { refetchInterval } = useConfigStore();

  return useQuery({
    queryKey: ['tareas', filtro, pagina, tableroId],
    queryFn: async () => {
      await delay(500);
      const res = await fetch(
        `/api/tareas?filtro=${filtro}&page=${pagina}&limit=5&tableroId=${tableroId}`
      );
      if (!res.ok) throw new Error('Error al cargar tareas');
      return res.json();
    },
    enabled: !!tableroId,
    refetchInterval,
  });
};
import { useMutation, useQueryClient } from '@tanstack/react-query';


// Agregar tarea
export const useAgregarTarea = (
  filtro: string,
  pagina: number,
  tableroId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (texto: string) => {
      const res = await fetch('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'agregar', texto, tableroId }),
      });
      if (!res.ok) throw new Error('Error al agregar tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tareas', filtro, pagina, tableroId],
      });
    },
  });
};

// Toggle tarea
export const useToggleTarea = (
  filtro: string,
  pagina: number,
  tableroId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'toggle', id }),
      });
      if (!res.ok) throw new Error('Error al actualizar tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tareas', filtro, pagina, tableroId],
      });
    },
  });
};

// Borrar tarea
export const useBorrarTarea = (
  filtro: string,
  pagina: number,
  tableroId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'borrar', id }),
      });
      if (!res.ok) throw new Error('Error al borrar tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tareas', filtro, pagina, tableroId],
      });
    },
  });
};

// Limpiar tareas
export const useLimpiarTareas = (
  filtro: string,
  pagina: number,
  tableroId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'limpiar', tableroId }),
      });
      if (!res.ok) throw new Error('Error al limpiar tareas');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tareas', filtro, pagina, tableroId],
      });
    },
  });
};

// Editar tarea
export const useEditarTarea = (
  filtro: string,
  pagina: number,
  tableroId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, texto }: { id: string; texto: string }) => {
      const res = await fetch('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'editar', id, texto }),
      });
      if (!res.ok) throw new Error('Error al editar tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tareas', filtro, pagina, tableroId],
      });
    },
  });
};
