import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function useCategorias() {
  const queryClient = useQueryClient();

  const categoriasQuery = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/categorias`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("URL inválida: El tablero no existe");
        }
        throw new Error("Error al cargar categorías");
      }
      return res.json();
    },
  });


  // Agregar
  const addCategoriaMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await fetch(`${API_URL}/api/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
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
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ["categorias"] });

    if (data.length > 0) {
      window.location.href = `/categorias/${data[0].id}`; // Redirige al primer tablero disponible
    } else {
      window.location.href = "/settings"; // Redirige a la página de configuraciones
    }
  },
});

  return { categoriasQuery, addCategoriaMutation, deleteCategoriaMutation };
}