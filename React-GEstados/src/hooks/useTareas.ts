import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTarea,
  toggleTarea,
  deleteTarea,
  clearCompletadas,
  clearAll,
  updateTarea,
  fetchTareas,
} from "../api";
import toast from "react-hot-toast";
import { useConfigStore } from "../store";

type UseTareasParams = {
  filter: string;
  page?: number;
  limit?: number;
  boardId: string;
};

export const useTareas = ({ filter, page = 1, boardId }: UseTareasParams) => {
  const { refetchInterval, tareasPorPagina } = useConfigStore();

  return useQuery({
    queryKey: ["tareas", filter, page, boardId, tareasPorPagina, refetchInterval],
    queryFn: () => fetchTareas(filter, page, tareasPorPagina, boardId),
    refetchInterval,
    refetchIntervalInBackground: true,
    enabled: useConfigStore.getState()._hasHydrated,
  });
};

const createMutation = <T,>(
  mutationFn: (input: T) => Promise<any>,
  successMsg: string,
  errorMsg: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(successMsg);
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
    },
    onError: () => {
      toast.error(errorMsg);
    },
  });
};

export const useAddTarea = () =>
  createMutation(
    ({ text, boardId }: { text: string; boardId: string }) => addTarea(text, boardId),
    "Tarea agregada",
    "Error al agregar tarea"
  );

export const useToggleTarea = () =>
  createMutation(
    ({ id, boardId }: { id: number; boardId: string }) => toggleTarea(id, boardId),
    "Tarea actualizada",
    "Error al actualizar tarea"
  );

export const useDeleteTarea = () =>
  createMutation(
    ({ id, boardId }: { id: number; boardId: string }) => deleteTarea(id, boardId),
    "Tarea eliminada",
    "Error al eliminar tarea"
  );

export const useClearCompletadas = () =>
  createMutation(
    ({ boardId }: { boardId: string }) => clearCompletadas(boardId),
    "Tareas completadas borradas",
    "Error al borrar completadas"
  );

export const useClearAll = () =>
  createMutation(
    ({ boardId }: { boardId: string }) => clearAll(boardId),
    "Todas las tareas borradas",
    "Error al borrar todo"
  );

export const useUpdateTarea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text, boardId }: { id: number; text: string; boardId: string }) =>
      updateTarea(id, text, boardId),
    onSuccess: () => {
      toast.success("Tarea actualizada");
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
    },
    onError: () => toast.error("Error al actualizar tarea"),
  });
};