import { useQuery } from "@tanstack/react-query";
import { Task } from "../types";

export const useTodasLasTareas = (boardId: string) => {
  return useQuery<Task[]>({
    queryKey: ["todasLasTareas", boardId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:4000/api/tasks/all?boardId=${boardId}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al cargar todas las tareas");

      return res.json();
    },
  });
};
