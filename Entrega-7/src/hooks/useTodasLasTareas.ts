// src/hooks/useTodasLasTareas.ts
import { useQuery } from "@tanstack/react-query";
import { Tarea } from "../types";

export const useTodasLasTareas = () => {
  return useQuery<Tarea[]>({
    queryKey: ["todas-las-tareas"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/tasks");
      if (!res.ok) throw new Error("Error al cargar todas las tareas");
      return res.json();
    },
  });
};
