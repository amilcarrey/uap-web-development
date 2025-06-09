import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../types/Task";
import axios from "axios";
import { useUIStore } from "../store/useUIStore";
import toast from "react-hot-toast";
import { useSettingsStore } from '../store/useSettingsStore';

const BASE_URL = import.meta.env.VITE_API_URL;

export interface TaskResponse {
  tasks: Task[];
  total: number;
  limit: number;
  offset: number;
}

export const useTasks = (boardId: number) => {
    const offset = useUIStore((state) => state.offset);
    const filter = useUIStore((state) => state.filter);
    const { refetchInterval, paginationLimit: limit } = useSettingsStore();

    return useQuery<TaskResponse>({
        queryKey: ['tasks', boardId, filter, offset, limit],
        queryFn: async () => {
            const { data } = await axios.get(
                `${BASE_URL}?boardId=${boardId}&limit=${limit}&offset=${offset}&filter=${filter}`
            );
            return data;
        },
        refetchInterval,
    });
};

export const useAddTask = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ text, boardId }: { text: string; boardId: number }) => {
            const { data } = await axios.post(BASE_URL, { text, boardId });
            if (!data) {
                throw new Error("Error al agregar tarea");
            }
            return data;
        },
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("¡Tarea agregada exitosamente!");
    },
    onError: () => {
      toast.error("Error al agregar la tarea");
    },
  });
};

export const useToggleTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      const { data } = await axios.put(`${BASE_URL}/${id}`, { completed });
      if (!data) {
        throw new Error("Error al actualizar tarea");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarea actualizada");
    },
    onError: () => {
      toast.error("Error al actualizar la tarea");
    },
  });
};

export const useEditTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, text }: { id: string; text: string }) => {
      const { data } = await axios.put(`${BASE_URL}/${id}`, { text });
      if (!data) {
        throw new Error("Error al editar tarea");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarea Editada exitosamente");
    },
    onError: () => {
      toast.error("Error al editar la tarea");
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${BASE_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarea eliminada");
    },
    onError: () => {
      toast.error("Error al eliminar la tarea");
    },
  });
};

export const useClearCompletedTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axios.delete(`${BASE_URL}/completed`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["tasks"]});
      toast.success('Tareas Completas eliminadas');
  },
  onError: () => {
      toast.error('Error al eliminar las tareas');
  }
  });
};
