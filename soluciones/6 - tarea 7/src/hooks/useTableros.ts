import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Tablero } from "../types";

const API = "http://localhost:3001/tableros";

// Consulta todos los tableros
export function useTableros() {
  return useQuery({
    queryKey: ["tableros"],
    queryFn: async () => {
      const res = await axios.get<Tablero[]>(API);
      return res.data;
    },
    staleTime: 20000, // Opcional: mantiene los tableros 'frescos' por 20 segundos
  });
}

// Crear un nuevo tablero
export function useCrearTablero() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Tablero, "id">) => axios.post(API, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
    },
  });
}

// Eliminar un tablero
export function useEliminarTablero() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axios.delete(`${API}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
    },
  });
}
