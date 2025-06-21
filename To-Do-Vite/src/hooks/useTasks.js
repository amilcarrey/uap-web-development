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
  list: (boardName) => [...taskKeys.lists(), boardName],
  details: () => [...taskKeys.all, 'detail'],
  detail: (boardName, taskId) => [...taskKeys.details(), boardName, taskId],
};

// Hook para obtener tareas de un tablero
export const useTasks = (boardName) => {
  const refetchInterval = useAppStore((state) => state.settings.refetchInterval) || 30;

  return useQuery({
    queryKey: taskKeys.list(boardName),
    queryFn: () => fetchTasks(boardName),
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
      // Actualizar la lista de tareas
      queryClient.setQueryData(taskKeys.list(boardName), (oldData) => {
        if (!oldData) return [newTask];
        return [...oldData, newTask];
      });
      
      // Invalidar la query para asegurar sincronización
      queryClient.invalidateQueries({ queryKey: taskKeys.list(boardName) });
      
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
      // Actualizar la tarea en la lista
      queryClient.setQueryData(taskKeys.list(boardName), (oldData) => {
        if (!oldData) return [updatedTask];
        return oldData.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
      });
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: taskKeys.list(boardName) });
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.detail(boardName, updatedTask.id) 
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
      // Remover la tarea de la lista
      queryClient.setQueryData(taskKeys.list(boardName), (oldData) => {
        if (!oldData) return [];
        return oldData.filter(task => task.id !== taskId);
      });
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: taskKeys.list(boardName) });
      queryClient.removeQueries({ 
        queryKey: taskKeys.detail(boardName, taskId) 
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
      // Remover tareas completadas de la lista
      queryClient.setQueryData(taskKeys.list(boardName), (oldData) => {
        if (!oldData) return [];
        return oldData.filter(task => !task.completed);
      });
      
      // Invalidar la query
      queryClient.invalidateQueries({ queryKey: taskKeys.list(boardName) });
      
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
      await queryClient.cancelQueries({ queryKey: taskKeys.list(boardName) });

      // Snapshot del valor anterior
      const previousTasks = queryClient.getQueryData(taskKeys.list(boardName));

      // Optimistic update
      queryClient.setQueryData(taskKeys.list(boardName), (oldData) => {
        if (!oldData) return [];
        return oldData.map(task => 
          task.id === taskId ? { ...task, completed } : task
        );
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Revertir en caso de error
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.list(boardName), context.previousTasks);
      }
      addToast('Error al actualizar la tarea', 'error');
      console.error('Error toggling task:', err);
    },
    onSettled: () => {
      // Invalidar para asegurar sincronización
      queryClient.invalidateQueries({ queryKey: taskKeys.list(boardName) });
    },
  });
}; 