import { useParams } from "@tanstack/react-router";
import { useTablero } from "./useTableros";

export function useTableroActivo() {
  const { tableroId } = useParams({ from: "/tablero/$tableroId" });
  return useTablero(tableroId);
}