// hooks/useInviteUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useInviteUser(board_id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { user_id: string; access_level: string }) => {
      const res = await fetch(`http://localhost:3000/api/board/invite-user/${board_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      console.log("Response status:", res.status);
      console.log("Response OK:", res.ok);
  

      if (!res.ok) {
        
        const errorText = await res.text();
          console.error("Full error response:", errorText);

               let errorData: { message?: string } = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error("Could not parse error as JSON:", e);
        }
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
