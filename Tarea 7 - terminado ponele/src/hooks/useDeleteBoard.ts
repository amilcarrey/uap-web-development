// src/hooks/useDeleteBoard.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boardId: string) => {
      const res = await fetch(`http://localhost:4321/api/boards/${boardId}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar el tablero");
      }

      const data = await res.json();
      return data.board;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}