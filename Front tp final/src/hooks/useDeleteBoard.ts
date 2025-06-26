// src/hooks/useDeleteBoard.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  //const { token } = useAuth();

  return useMutation({
    mutationFn: async (boardId: string) => {
      const res = await fetch(`http://localhost:3000/api/board/${boardId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al eliminar el tablero");
      }

      try {
        return await res.json();
      } catch {
        return true;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"]});
    },
  });
}