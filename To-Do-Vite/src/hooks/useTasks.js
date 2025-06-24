import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  deleteCompletedTasks 
} from '../config/api';
import useAppStore from '../stores/appStore';

// Query key factory para tareas
export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  list: (boardName, params = {}) => [...taskKeys.lists(), boardName, params],
  details: () => [...taskKeys.all, 'detail'],
  detail: (boardName, taskId) => [...taskKeys.details(), boardName, taskId],
};

// Hook para obtener tareas de un tablero
export const useTasks = (boardName, params = {}) => {
  const refetchInterval = useAppStore((state) => state.settings.refetchInterval) || 30;

  return useQuery({
    queryKey: taskKeys.list(boardName, params),
    queryFn: () => fetchTasks(boardName, params),
    staleTime: refetchInterval * 1000, // Usar configuración del store
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval * 1000, // Refetch automático
  });
};

// Hook para crear una tarea
export const useCreateTask = (boardName) => {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();

  return useMutation({
    mutationFn: ({ text }) => createTask(boardName, text),
    onSuccess: (newTask) => {
      // Invalidar todas las queries de tareas para este tablero
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.lists().concat(boardName)
      });
      
      addToast('Tarea creada exitosamente', 'success');
    },
    onError: (error) => {
      addToast('Error al crear la tarea', 'error');
      console.error('Error creating task:', error);
    },
  });
};

// Hook para actualizar una tarea
export const useUpdateTask = (boardName) => {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();

  return useMutation({
    mutationFn: ({ taskId, updates }) => updateTask(boardName, taskId, updates),
    onSuccess: (updatedTask) => {
      // Invalidar todas las queries de tareas para este tablero
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.lists().concat(boardName)
      });
      
      addToast('Tarea actualizada exitosamente', 'success');
    },
    onError: (error) => {
      addToast('Error al actualizar la tarea', 'error');
      console.error('Error updating task:', error);
    },
  });
};

// Hook para eliminar una tarea
export const useDeleteTask = (boardName) => {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();

  return useMutation({
    mutationFn: ({ taskId }) => deleteTask(boardName, taskId),
    onSuccess: (_, { taskId }) => {
      // Invalidar todas las queries de tareas para este tablero
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.lists().concat(boardName)
      });
      
      addToast('Tarea eliminada exitosamente', 'success');
    },
    onError: (error) => {
      addToast('Error al eliminar la tarea', 'error');
      console.error('Error deleting task:', error);
    },
  });
};

// Hook para eliminar tareas completadas
export const useDeleteCompletedTasks = (boardName) => {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();

  return useMutation({
    mutationFn: () => deleteCompletedTasks(boardName),
    onSuccess: () => {
      // Invalidar todas las queries de tareas para este tablero
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.lists().concat(boardName)
      });
      
      addToast('Tareas completadas eliminadas exitosamente', 'success');
    },
    onError: (error) => {
      addToast('Error al eliminar las tareas completadas', 'error');
      console.error('Error deleting completed tasks:', error);
    },
  });
};

// Hook para optimistic updates (toggle completado)
export const useToggleTask = (boardName) => {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();

  return useMutation({
    mutationFn: ({ taskId, completed }) => updateTask(boardName, taskId, { completed }),
    onMutate: async ({ taskId, completed }) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ 
        queryKey: taskKeys.lists().concat(boardName)
      });

      // Snapshot del valor anterior
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: taskKeys.lists().concat(boardName)
      });

      // Optimistic update para todas las queries activas
      queryClient.setQueriesData({ 
        queryKey: taskKeys.lists().concat(boardName)
      }, (oldData) => {
        if (!oldData || !oldData.tasks) return oldData;
        return {
          ...oldData,
          tasks: oldData.tasks.map(task => 
            task.id === taskId ? { ...task, completed } : task
          )
        };
      });

      return { previousQueries };
    },
    onError: (err, variables, context) => {
      // Revertir en caso de error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      addToast('Error al actualizar la tarea', 'error');
      console.error('Error toggling task:', err);
    },
    onSettled: () => {
      // Invalidar para asegurar sincronización
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.lists().concat(boardName)
      });
    },
  });
}; 