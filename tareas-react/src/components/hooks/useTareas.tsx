import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Tarea } from "../../types";

export function useTareas(tableroId?: string) {
  return useQuery<Tarea[]>({
    queryKey: ["tareas", tableroId],
    queryFn: () =>
      axios
        .get("http://localhost:8008/api/tareas", {
          params: { tablero_id: tableroId },
        })
        .then((res) =>
          res.data.tareas
            ? res.data.tareas.map((t: any) => ({
                ...t,
                texto: t.texto ?? t.descripcion,
                tableroId: t.tablero_id ?? t.tableroId,
                completada: !!t.completada,
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
            : []
        ),
    enabled: !!tableroId,
  });
}