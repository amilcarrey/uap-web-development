// src/hooks/useAddTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from '../store/toastStore';

const BASE_URL = "http://localhost:4321/api";

interface AddTaskVariables {
  text: string;
  boardId: string;
}

export function useAddTask(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // Ahora la función espera un objeto con { text, boardId }
    mutationFn: async ({ text, boardId }: AddTaskVariables) => {
      const res = await fetch(`${BASE_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, boardId }), //  incluimos boardId
      });
      if (!res.ok) {
        throw new Error("Error al agregar tarea");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidateamos la query que usa ese mismo boardId
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
      useToastStore.getState().addToast({
        message: "Tarea agregada con éxito",
        type: "success",
      });
    },
    onError: () => {
      useToastStore.getState().addToast({
        message: "Error al agregar la tarea",
        type: "error",
      });
    },
  });
}
