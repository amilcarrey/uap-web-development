import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Board } from "../type";

const API_BASE = "http://localhost:3000";

export const useBoards = () => {
  const queryClient = useQueryClient();

  const boardsQuery = useQuery<Board[]>({
    queryKey: ["boards"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/boards`,{
      credentials: "include",
      });
      
      if (!res.ok) throw new Error("Error al cargar tableros");
      return await res.json();
    },
  });

  const addBoard = useMutation({
    mutationFn: async (board: Omit<Board, "id">) => {
      const res = await fetch(`${API_BASE}/api/boards`, {
        method: "POST",
        body: JSON.stringify(board),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al crear tablero");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });


  const deleteBoard = useMutation({
      mutationFn: async (id: string) => {
        const res = await fetch(`${API_BASE}/api/boards/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al eliminar tablero");
        return id;
      },
      onSuccess: (deletedBoardId: string) => {
        // Refrescar la lista de tableros después de eliminar
        queryClient.invalidateQueries({ queryKey: ["boards"] });
        queryClient.invalidateQueries({ queryKey: ["tasks", { boardId: deletedBoardId }] });
      },
  });

  return { 
    ...boardsQuery, 
    addBoard: addBoard.mutate,
    isAdding: addBoard.isPending,
    deleteBoard: deleteBoard.mutate,
    isDeleting: deleteBoard.isPending,
    };
};

