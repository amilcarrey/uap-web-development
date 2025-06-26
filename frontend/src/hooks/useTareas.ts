import { useQuery } from "@tanstack/react-query";
import { Task } from "../types";
import { useConfiguracionStore } from "../store/configuracionStore";

export const useTareas = (boardId: string, page: number, limit: number) => {
  const intervaloRefetch = useConfiguracionStore((s) => s.intervaloRefetch);

  return useQuery<Task[]>({
    queryKey: ["tasks", boardId, page, limit],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:4000/api/tasks?boardId=${boardId}&page=${page}&limit=${limit}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Error al cargar tareas");
      return res.json();
    },
    refetchInterval: intervaloRefetch,
  });
};
