// src/hooks/useTareas.ts
import { useQuery } from "@tanstack/react-query";
import { Tarea } from "../types";

export const useTareas = () => {
  return useQuery<Tarea[]>({
    queryKey: ["tareas"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/tasks");
      if (!res.ok) throw new Error("Error al cargar tareas");
      return res.json();
    },
  });
};
