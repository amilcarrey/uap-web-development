import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Tarea } from "../types/tarea";
import { useSettingsStore } from "../store/Configuraciones";
import { useToastStore } from "../store/NotificacionesStore";

const PAGE_SIZE = 5;

export const useTareas = (tableroId: string, page: number) => {
  const queryClient = useQueryClient();
  const refetchInterval = useSettingsStore((s) => s.refetchInterval);
  const addToast = useToastStore((s) => s.addToast);

  const tareasQuery = useQuery<Tarea[]>({
    queryKey: ["tareas", tableroId, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        tableroId,
        _page: String(page),
        _limit: String(PAGE_SIZE),
      });

      // CAMBIO IMPORTANTE: apuntamos directo al json-server
      const res = await fetch(`http://localhost:4321/tareas?${params.toString()}`);
      if (!res.ok) throw new Error("Error al obtener tareas");
      return res.json();
    },
    refetchInterval,
  });

  const addTarea = useMutation({
    mutationFn: (content: string) =>
      axios.post("http://localhost:4321/tareas", {
        content,
        tableroId,
        completed: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      addToast({ message: "Tarea agregada", type: "success" });
    },
    onError: () =>
      addToast({ message: "Error al agregar tarea", type: "error" }),
  });

  const updateTarea = useMutation({
    mutationFn: (tarea: Tarea) =>
      axios.put(`http://localhost:4321/tareas/${tarea.id}`, tarea),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      addToast({ message: "Tarea actualizada", type: "success" });
    },
    onError: () =>
      addToast({ message: "Error al actualizar tarea", type: "error" }),
  });

  const deleteTarea = useMutation({
    mutationFn: (id: number) =>
      axios.delete(`http://localhost:4321/tareas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      addToast({ message: "Tarea eliminada", type: "success" });
    },
    onError: () =>
      addToast({ message: "Error al eliminar tarea", type: "error" }),
  });

  return {
    tareasQuery,
    addTarea,
    updateTarea,
    deleteTarea,
  };
};
