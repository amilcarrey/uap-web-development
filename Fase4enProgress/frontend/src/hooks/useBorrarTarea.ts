import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useBorrarTarea = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`http://localhost:4000/api/tasks/${id}?boardId=${boardId}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
    },
  });
};
