import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const TAREAS_POR_PAGINA = 3;
const API_URL = "http://localhost:8008/tareas";

export function useTareas(pagina: number, filtro: string, tableroId: string) {
  return useQuery({
    queryKey: ["tareas", pagina, filtro, tableroId],
    queryFn: async () => {
      let url = `${API_URL}?_page=${pagina}&_limit=${TAREAS_POR_PAGINA}&tableroId=${tableroId}`;
      if (filtro === "activas") url += "&completada=false";
      if (filtro === "completadas") url += "&completada=true";
      const res = await axios.get(url);
      return {
        tareas: res.data,
        total: Number(res.headers["x-total-count"]),
      };
    },
    keepPreviousData: true,
    enabled: !!tableroId,
  });
}