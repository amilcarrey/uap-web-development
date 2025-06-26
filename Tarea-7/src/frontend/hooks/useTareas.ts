import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../store/NotificacionesStore";
import type { Tarea } from "../types/tarea";

export const useTareas = (tableroId: string, page: number, search: string) => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  const tareasQuery = useQuery({
    queryKey: ["tareas", tableroId, page, search],
    queryFn: async () => {
      const url = new URL("/api/tareas", window.location.origin);
      url.searchParams.append("tableroId", tableroId);
      url.searchParams.append("page", page.toString());
      if (search.trim()) {
        url.searchParams.append("search", search.trim());
      }
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("No se pudieron cargar las tareas");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(tableroId),
  });

  const addTarea = useMutation({
    mutationFn: async ({ content, tableroId }: { content: string; tableroId: string }) => {
      const res = await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, tableroId }),
      });
      if (!res.ok) throw new Error("No se pudo agregar la tarea");
      return res.json();
    },
    onSuccess: (_, { tableroId }) => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      addToast({ message: "Tarea agregada", type: "success" });
    },
    onError: () => {
      addToast({ message: "Error al agregar tarea", type: "error" });
    },
  });

  const updateTarea = useMutation({
    mutationFn: async (tarea: Tarea) => {
      const res = await fetch(`/api/tareas/${tarea.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarea),
      });
      if (!res.ok) throw new Error("No se pudo actualizar la tarea");
      return res.json();
    },
    onSuccess: (_, tarea) => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tarea.tableroId] });
      addToast({ message: "Tarea actualizada", type: "success" });
    },
    onError: () => {
      addToast({ message: "Error al actualizar tarea", type: "error" });
    },
  });

  const deleteTarea = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/tareas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar la tarea");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      addToast({ message: "Tarea eliminada", type: "success" });
    },
    onError: () => {
      addToast({ message: "Error al eliminar tarea", type: "error" });
    },
  });

  return {
    tareas: tareasQuery.data,
    status: tareasQuery.status,
    addTarea,
    updateTarea,
    deleteTarea,
  };
};
