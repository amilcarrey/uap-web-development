import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";

export const useBorrarCompletadas = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`/tasks/${boardId}/completadas`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas', boardId] });
    },
  });
};
