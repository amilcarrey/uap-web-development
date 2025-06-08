// src/hooks/useTasks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBoards, createBoard, deleteBoard, // Funciones de API para tableros
  getTasks, addTask, toggleTaskCompletion, deleteTask, clearCompletedTasks, updateTask,
  getGlobalConfig, updateGlobalConfig, // ¡Nuevas funciones de API para configuración!
} from '../api/tasks';

// --- Hooks para Tableros (Boards) ---
export const useBoards = () => {
  return useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] }); // Invalida la lista de tableros
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      // Si borras un tablero, también querrás invalidar sus tareas
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Invalidar todas las queries de tareas
    },
  });
};

// --- Hooks para Tareas (Ahora requieren boardId) ---
export const useTasks = (boardId, filter, page, limit) => {
  // Usamos el hook useGlobalConfig aquí para obtener el intervalo de refetch
  const { data: config } = useGlobalConfig();
  const refetchInterval = config?.refetch_interval; // Obtiene el intervalo de refetch de la configuración

  return useQuery({
    queryKey: ['tasks', boardId, filter, page, limit], // boardId en la queryKey
    queryFn: () => getTasks(boardId, filter, page, limit), // boardId pasado a getTasks
    enabled: !!boardId, // Solo habilita la query si tenemos un boardId
    // Aplica el intervalo de refetch dinámicamente
    refetchInterval: refetchInterval > 0 ? refetchInterval : false,
    refetchIntervalInBackground: true, // Para que siga refetching incluso si la ventana no está en foco
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, taskText }) => addTask(boardId, taskText), // Acepta boardId
    onSuccess: (_, variables) => {
      // Invalida solo las tareas del boardId específico
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
    },
  });
};

export const useToggleTaskCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, id }) => toggleTaskCompletion(boardId, id), // Acepta boardId
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, id }) => deleteTask(boardId, id), // Acepta boardId
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
    },
  });
};

export const useClearCompletedTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId) => clearCompletedTasks(boardId), // Acepta boardId directamente
    onSuccess: (_, boardId) => { // _ es el data devuelto, boardId es la variable pasada
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, id, updatedTaskData }) => updateTask(boardId, id, updatedTaskData), // Acepta boardId
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });
};

// --- NUEVOS Hooks para Configuraciones Globales ---
export const useGlobalConfig = () => {
    return useQuery({
        queryKey: ['globalConfig'],
        queryFn: getGlobalConfig,
        // Mantener los datos en caché para que las actualizaciones se sientan instantáneas
        // y se refetch automáticamente si la configuración cambia en otra parte
        staleTime: Infinity, // Marcar como "stale" inmediatamente, pero no refetchear
        refetchOnWindowFocus: false, // No refetchear al cambiar de foco
        refetchOnMount: true, // Refetchear al montar el componente que lo usa
    });
};

export const useUpdateGlobalConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateGlobalConfig,
        onSuccess: (data) => {
            // Actualiza el caché de React Query con la nueva configuración
            queryClient.setQueryData(['globalConfig'], data.config);
        },
        onError: (error) => {
            console.error("Error updating global config:", error);
        },
    });
};