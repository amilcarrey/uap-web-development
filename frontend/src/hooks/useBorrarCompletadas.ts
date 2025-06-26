import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useBorrarCompletadas = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await fetch(`http://localhost:4000/api/tasks/${boardId}/completadas`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
    },
  });
};
