// hooks/useInviteUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useInviteUser(boardId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { user_id: string; access_level: string }) => {
      const res = await fetch(`http://localhost:3000/api/board/${boardId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "No se pudo invitar al usuario");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidar las queries relacionadas con los tableros
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
