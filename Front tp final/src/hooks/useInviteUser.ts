// hooks/useInviteUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../store/toastStore";

export function useInviteUser(board_id: string) {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  
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

        // Manejar diferentes tipos de errores de autorización
        if (res.status === 403) {
          showToast("No tienes permisos para invitar usuarios a este tablero", "error");
          throw new Error("Sin permisos");
        } else if (res.status === 401) {
          showToast("Debes iniciar sesión para realizar esta acción", "error");
          throw new Error("No autenticado");
        } else if (res.status === 404) {
          showToast("El tablero no existe o no tienes acceso", "error");
          throw new Error("Tablero no encontrado");
        }
        
        throw new Error(errorData.message || "No se pudo invitar al usuario");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidar las queries relacionadas con los tableros
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      showToast("Usuario invitado exitosamente", "success");
    },
  });
}
