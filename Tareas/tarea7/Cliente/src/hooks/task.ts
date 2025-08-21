import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '../components/TaskItem';
import { useConfigStore } from '../stores/configStore';


const fetchTasks = async (tabId: string, page: number, limit: number) => {
  const res = await fetch(`http://localhost:4321/api/tasks?tab=${tabId}&page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: { accept: 'application/json' },
  });
  const result = await res.json()
  
  return result.tasks
};

export function useTasks(tabId: string, page:number=1, limit:number=5) {
  const refetchInterval = useConfigStore(s => s.refetchInterval);

  return useQuery<Task[]>({
    queryKey: ['tasks', tabId, page, limit],
    queryFn: () => fetchTasks(tabId, page, limit),
    initialData: [],
    refetchInterval,
  });
}

export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, tabId }: { text: string; tabId: string }) => {
      const res = await fetch('http://localhost:4321/api/tasks', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: new URLSearchParams({
          action: 'add',
          text,
          tabId,
        }),
      });
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });

    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, tabId }: { taskId: string; tabId: string }) => {
      const res = await fetch('http://localhost:4321/api/tasks', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: new URLSearchParams({
          action: 'delete',
          taskId,
          tabId,
        }),
      });
      if (!res.ok) throw new Error('Error al eliminar tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, tabId, completed }: { taskId: string; tabId: string; completed: boolean }) => {
      const res = await fetch('http://localhost:4321/api/tasks', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: new URLSearchParams({
          action: 'toggle',
          taskId,
          tabId,
          completed: String(completed),
        }),
      });
      if (!res.ok) throw new Error('Error al alternar tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
    },
  });
}

export function useEditTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, tabId, text }: { taskId: string; tabId: string; text: string }) => {
      const res = await fetch('http://localhost:4321/api/tasks', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: new URLSearchParams({
          action: 'edit',
          taskId,
          tabId,
          text,
        }),
      });
      if (!res.ok) throw new Error('Error al editar tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
    },
  });
}

export function useClearCompletedTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tabId: string) => {
      const res = await fetch('http://localhost:4321/api/tasks', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: new URLSearchParams({
          action: 'clear-completed',
          tabId,
        }),
      });
      if (!res.ok) throw new Error('Error al limpiar tareas completadas');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
    },
  });
}
