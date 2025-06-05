import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../store/toastStore";

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      text,
      boardId,
    }: {
      id: string;
      text: string;
      boardId: string;
    }) => {
      const res = await fetch("http://localhost:4321/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, text, boardId }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
