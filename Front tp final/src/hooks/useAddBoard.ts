// hooks/useCreateBoard.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";  

export function useCreateBoard() {
  const queryClient = useQueryClient();
  //const { token } = useAuth();

//console.log("Token usado en createBoard:", token);


  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("http://localhost:3000/api/board/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      

      });
      if (!res.ok) throw new Error("Error al crear el board");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
