import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfigStore } from "../state/configStore";
import type { Task } from "../state/taskStore";

const API_URL = "http://localhost:3000/tareas";

export const useTasks = (boardId: string) => {
  const refetchInterval = useConfigStore.getState().refetchInterval;

  return useQuery({
    queryKey: ['tasks', boardId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}?boardId=${boardId}`);
      if (!res.ok) throw new Error("Error al cargar tareas");
      const data: Task[] = await res.json();
      return data;
    },
    refetchInterval,
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, boardId }: { name: string; boardId: string }) => {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, completed: false, boardId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useEditTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useToggleTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Task) => {
      const res = await fetch(`${API_URL}/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
