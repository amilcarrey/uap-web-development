import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useConfigStore } from '@/stores/configStore';
import { API } from '@/lib/api';

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
      //await delay(500);
      const res = await fetch(
        `${API}/api/tareas?filtro=${filtro}&pagina=${pagina}&limit=5&tableroId=${tableroId}`
      );
      if (!res.ok) throw new Error('Error al cargar tareas');

      const json = await res.json();

      // Transformar completada a booleano
      const tareas = json.tareas.map((t: any) => ({
        ...t,
        completada: Boolean(t.completada),
      }));
      console.log('Tareas obtenidas:', tareas);
      return { ...json, tareas }; // asegurarse de mantener la estructura original
    },

    enabled: !!tableroId,
    refetchInterval,
  });
};

// Agregar tarea
export const useAgregarTarea = (
  filtro: string,
  pagina: number,
  tableroId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (texto: string) => {
      if (!tableroId) {
        console.error('❌ No se puede agregar tarea sin tableroId');
        throw new Error('Falta tableroId');
      }

      const res = await fetch(`${API}/api/tareas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, tableroId }),
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
      const res = await fetch(`${API}/api/tareas/${id}/toggle`, {
        method: 'PUT',
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
export function useBorrarTarea(filtro: string, pagina: number, tableroId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API}/api/tareas/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al borrar');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tareas', filtro, pagina, tableroId],
      });
    },
  });
}

// Limpiar tareas
export const useLimpiarTareas = (
  filtro: string,
  pagina: number,
  tableroId: string
) => {
  const queryClient = useQueryClient();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API}/api/tareas/limpiar/${tableroId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ agregar token aquí
        },
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
      const res = await fetch(`${API}/api/tareas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto }),
      });

      if (!res.ok) throw new Error('Error al editar tarea');
      console.log('Se editó:', { id, texto });

      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['tareas', filtro, pagina, tableroId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          tareas: old.tareas.map((t: any) =>
            t.id === variables.id ? { ...t, texto: variables.texto } : t
          ),
        };
      });
    },
  });
};



