import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Tarea } from "../types";

const API = "http://localhost:3001/tareas";

interface TareasResponse {
  tareas: Tarea[];
  total: number;
}

export function useTareas(
  tableroId: string,
  page: number,
  pageSize: number,
  refetchInterval: number,
  options = {}
) {
  return useQuery<TareasResponse, Error>({
    queryKey: ["tareas", tableroId, page, pageSize],
    queryFn: async () => {
      const res = await axios.get<Tarea[]>(
        `${API}?tableroId=${tableroId}&_page=${page}&_limit=${pageSize}`
      );
      const total = parseInt(res.headers["x-total-count"] || "0");
      return { tareas: res.data, total };
    },
    refetchInterval,
    ...options,
  });
}


export function useCrearTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Tarea, "id">) => axios.post(API, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tareas", variables.tableroId] });
    },
  });
}

export function useActualizarTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tarea: Tarea) => axios.put(`${API}/${tarea.id}`, tarea),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tareas", response.data.tableroId] });
    },
  });
}

export function useEliminarTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; tableroId: string }) => axios.delete(`${API}/${payload.id}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tareas", variables.tableroId] });
    },
  });
}


