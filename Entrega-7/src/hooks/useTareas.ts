import { useQuery } from "@tanstack/react-query";
import { Tarea } from "../types";
import { useConfiguracionStore } from "../store/configuracionStore";

export const useTareas = (tableroId: string, page: number, limit: number) => {
  const intervaloRefetch = useConfiguracionStore((s) => s.intervaloRefetch);

  return useQuery<Tarea[]>({
    queryKey: ["tareas", tableroId, page, limit],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3000/tasks?tableroId=${tableroId}&_page=${page}&_limit=${limit}`
      );
      if (!res.ok) throw new Error("Error al cargar tareas");
      return res.json();
    },
    refetchInterval: intervaloRefetch,
  });
};
