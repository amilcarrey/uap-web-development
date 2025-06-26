import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../store/toastStore";
import { useAuth } from "./useAuth";

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
      if (!res.ok) throw new Error("No se pudo actualizar");
      return res.json();
    },
    onSuccess: (_data, variables) => {
      //console.log("Tarea actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.board_id] });
      useToastStore.getState().addToast({
        message: "Tarea actualizada correctamente",
        type: "success",
      });
    },
    onError: () => {
      useToastStore.getState().addToast({
        message: "Error al actualizar la tarea",
        type: "error",
      });
    },
  });
}
