import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:3000/tableros";

export type Tablero = {
  id: string;
  nombre: string;
};

export const useBoards = () => {
  return useQuery<Tablero[]>({
    queryKey: ['tableros'],
    queryFn: async () => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al cargar tableros");
      return res.json();
    },
  });
};

export const useAddBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, nombre }: Tablero) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nombre }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
  });
};
