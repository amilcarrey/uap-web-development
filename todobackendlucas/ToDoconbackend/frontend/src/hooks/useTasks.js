import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services';

// Hook para obtener tareas de un tablero
export const useTasks = (boardId) => {
  return useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => taskService.getTasks(boardId),
    enabled: !!boardId,
  });
};

// Hook para obtener una tarea específica
export const useTask = (boardId, taskId) => {
  return useQuery({
    queryKey: ['task', boardId, taskId],
    queryFn: () => taskService.getTask(boardId, taskId),
    enabled: !!boardId && !!taskId,
  });
};

// Hook para crear tarea
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ boardId, ...data }) => taskService.createTask(boardId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
    },
  });
};

// Hook para actualizar tarea
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ boardId, taskId, ...data }) => 
      taskService.updateTask(boardId, taskId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
      queryClient.invalidateQueries({ 
        queryKey: ['task', variables.boardId, variables.taskId] 
      });
    },
  });
};

// Hook para eliminar tarea
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ boardId, taskId }) => taskService.deleteTask(boardId, taskId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
    },
  });
};

// Hook para eliminar tareas completadas
export const useDeleteCompletedTasks = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskService.deleteCompletedTasks,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables] });
    },
  });
};
