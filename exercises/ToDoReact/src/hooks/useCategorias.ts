import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function useCategorias() {
  const queryClient = useQueryClient();

  const categoriasQuery = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/categorias`);
      if (!res.ok) throw new Error("Error al cargar categorías");
      return res.json();
    },
  });

  // Agregar
  const addCategoriaMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`${API_URL}/api/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _method: "ADD_CATEGORIA", name }),
      });
      if (!res.ok) throw new Error("Error al agregar categoría");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  // Eliminar
  const deleteCategoriaMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _method: "DELETE_CATEGORIA", id }),
      });
      if (!res.ok) throw new Error("Error al eliminar categoría");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  return { categoriasQuery, addCategoriaMutation, deleteCategoriaMutation };
}
