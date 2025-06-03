import { useQuery } from "@tanstack/react-query";
import type { Tarea } from "../types";

export function useTareas(page: number, filtro: string = "todas") {
  return useQuery({
    queryKey: ["tareas", page, filtro],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:4321/api/listar?page=${page}&limit=5&filtro=${filtro}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al cargar tareas");
      }

      const data = await res.json();

      if (
        !data ||
        !Array.isArray(data.tareas) ||
        typeof data.total !== "number" ||
        typeof data.page !== "number" ||
        typeof data.totalPages !== "number"
      ) {
        throw new Error("Datos mal formateados desde el servidor");
      }

      return data as {
        tareas: Tarea[];
        total: number;
        page: number;
        totalPages: number;
      };
    },
  });
}
