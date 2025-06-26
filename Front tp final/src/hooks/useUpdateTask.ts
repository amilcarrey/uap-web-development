import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../store/toastStore";


export function useUpdateTask() {
  const queryClient = useQueryClient();
 // const { token } = useAuth();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      board_id,
    }: {
      id: string;
      name: string;
      board_id: string;
    }) => {
      const res = await fetch(`http://localhost:3000/api/reminder/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          //  "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, name, board_id }),
      });
      
      if (!res.ok) {
        // Manejar diferentes tipos de errores
        if (res.status === 403) {
          throw new Error("No tienes permisos para actualizar esta tarea");
        } else if (res.status === 401) {
          throw new Error("Debes iniciar sesión para realizar esta acción");
        } else if (res.status === 404) {
          throw new Error("La tarea no existe o no tienes acceso");
        }
        
        throw new Error("No se pudo actualizar la tarea");
      }
      
      return res.json();
    },
    onSuccess: (_data, variables) => {
      //console.log("Tarea actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.board_id] });
      useToastStore.getState().showToast("Tarea actualizada correctamente", "success");
    },
    onError: (error: any) => {
      useToastStore.getState().showToast(error.message || "Error al actualizar la tarea", "error");
    },
  });
}
