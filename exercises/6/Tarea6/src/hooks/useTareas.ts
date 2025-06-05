import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Tarea } from '../types/types';

const API_URL = '/api/tareas';

// Tipo para los datos de tareas
interface TareasData {
  tareas: Tarea[];
  total: number;
}

// Hook para obtener tareas con paginación
export const useTareas = (page: number, limit: number = 10) => {
  return useQuery<TareasData>({
    queryKey: ['tareas', page],
    queryFn: async (): Promise<TareasData> => {
      // Obtener todas las tareas
      const url = API_URL;
      console.log(`Fetching URL: ${url}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error al cargar tareas: ${res.statusText}`);
      
      const allTareas: Tarea[] = await res.json();
      console.log(`Fetched all tareas (${allTareas.length} tareas):`, allTareas);
      
      // Ordenar y paginar en el cliente
      const tareas = allTareas
        .sort((a: Tarea, b: Tarea) => parseInt(a.id) - parseInt(b.id))
        .slice((page - 1) * limit, page * limit);
      console.log(`Paginated tareas for page ${page} (${tareas.length} tareas):`, tareas);
      
      // Calcular total
      const total = allTareas.length;
      console.log(`Total tareas: ${total}`);
      
      return { tareas, total };
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para agregar una tarea
export const useAgregarTarea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, completed: false }),
      });
      if (!res.ok) throw new Error('Error al agregar tarea');
      return await res.json();
    },
    onMutate: async (content) => {
      // Cancelar consultas en curso
      await queryClient.cancelQueries({ queryKey: ['tareas'] });
      
      // Obtener datos actuales de todas las páginas
      const previousData: { [page: number]: TareasData } = {};
      const pages = queryClient.getQueriesData({ queryKey: ['tareas'] });
      pages.forEach(([queryKey, data]) => {
        if (Array.isArray(queryKey) && queryKey[0] === 'tareas' && data) {
          const page = queryKey[1] as number;
          previousData[page] = data as TareasData;
        }
      });
      
      // Crear tarea optimista
      const newTarea: Tarea = {
        id: `${Object.keys(previousData).length * 10 + 1}`, // Estimación temporal
        content,
        completed: false,
      };
      
      // Actualizar todas las páginas
      Object.keys(previousData).forEach((page) => {
        const pageNum = parseInt(page);
        queryClient.setQueryData(['tareas', pageNum], (old: TareasData | undefined) => {
          if (!old) return { tareas: [], total: 0 };
          const newTareas = [...old.tareas, newTarea]
            .sort((a, b) => parseInt(a.id) - parseInt(b.id))
            .slice((pageNum - 1) * 10, pageNum * 10);
          return { tareas: newTareas, total: old.total + 1 };
        });
      });
      
      return { previousData };
    },
    onError: (err, content, context) => {
      // Revertir cambios optimistas
      Object.keys(context?.previousData || {}).forEach((page) => {
        queryClient.setQueryData(['tareas', parseInt(page)], context?.previousData[parseInt(page)]);
      });
    },
    onSettled: () => {
      // Invalidar todas las consultas de tareas
      queryClient.invalidateQueries({ queryKey: ['tareas'], exact: false });
    },
  });
};

// Hook para alternar el estado de una tarea
export const useToggleTarea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) throw new Error('Error al actualizar tarea');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'], exact: false });
    },
  });
};

// Hook para eliminar una tarea
export const useEliminarTarea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar tarea');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'], exact: false });
    },
  });
};

// Hook para eliminar tareas completadas
export const useEliminarCompletadas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}?completed=true`);
      if (!res.ok) throw new Error('Error al obtener tareas completadas');
      const tareasCompletadas: Tarea[] = await res.json();
      for (const tarea of tareasCompletadas) {
        const deleteRes = await fetch(`${API_URL}/${tarea.id}`, {
          method: 'DELETE',
        });
        if (!deleteRes.ok) throw new Error(`Error al eliminar tarea ${tarea.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'], exact: false });
    },
  });
};

// Hook para editar una tarea
export const useEditarTarea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Error al editar tarea');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'], exact: false });
    },
  });
};