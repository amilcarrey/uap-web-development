// hooks/useInviteUser.ts
import { useMutation } from "@tanstack/react-query";

export function useInviteUser(boardId: string) {
  return useMutation({
    mutationFn: async (payload: { user_id: string; access_level: string }) => {
      const res = await fetch(`http://localhost:3000/api/boards/${boardId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("No se pudo invitar al usuario");
      return res.json();
    },
  });
}
