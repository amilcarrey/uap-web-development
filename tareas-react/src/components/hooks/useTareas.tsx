import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Tarea } from "../../types";

interface TareasPaginadasResponse {
  tareas: Tarea[];
  total?: number;
  pagina?: number;
  porPagina?: number;
  totalPaginas?: number;
}

type UseTareasParams = {
  tableroId?: string;
  pagina?: number;
  porPagina?: number;
};

export function useTareas({ tableroId, pagina, porPagina }: UseTareasParams) {
  return useQuery<TareasPaginadasResponse>({
    queryKey: [
      "tareas",
      tableroId,
      pagina ?? "all",
      porPagina ?? "all"
    ],
    queryFn: () =>
      axios
        .get("http://localhost:8008/api/tareas", {
          params: {
            tablero_id: tableroId,
            ...(pagina && porPagina ? { pagina, porPagina } : {}),
          },
        })
        .then((res) => ({
          ...res.data,
          tareas: res.data.tareas
            ? res.data.tareas.map((t: any) => ({
                ...t,
                completada: !!t.completada,
                texto: t.texto ?? t.descripcion,
                tableroId: t.tablero_id ?? t.tableroId,
                fecha_creacion: t.fecha_creacion
                  ? new Date(Number(t.fecha_creacion)).toISOString()
                  : "",
                fecha_modificacion: t.fecha_modificacion
                  ? new Date(Number(t.fecha_modificacion)).toISOString()
                  : "",
                fecha_realizada: t.fecha_realizada
                  ? new Date(Number(t.fecha_realizada)).toISOString()
                  : "",
              }))
            : [],
        })),
    enabled: !!tableroId,
  });
}