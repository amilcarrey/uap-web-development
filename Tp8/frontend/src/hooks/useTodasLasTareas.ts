import { useQuery } from "@tanstack/react-query";
import { Task } from "../types";

export const useTodasLasTareas = () => {
  return useQuery<Task[]>({
    queryKey: ["all-tasks"],
    queryFn: async () => {
      const res = await fetch("http://localhost:4000/api/tasks", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al cargar todas las tareas");
      return res.json();
    },
  });
};
