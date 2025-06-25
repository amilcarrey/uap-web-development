import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useConfigStore } from "../store/useConfigStore";

type UseTareasParams = {
  tableroId?: string;
  pagina?: number;
  porPagina?: number;
};

export function useTareas({ tableroId, pagina, porPagina }: UseTareasParams) {
  const intervaloRefetch = useConfigStore((s) => s.intervaloRefetch);

  return useQuery({
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
          withCredentials: true, // <-- esto es clave
         }),
        select: (data) => {
      // Devuelve todo el objeto de respuesta del backend
      return data.data;
    },
    enabled: !!tableroId,
    refetchInterval: intervaloRefetch,
  });
}