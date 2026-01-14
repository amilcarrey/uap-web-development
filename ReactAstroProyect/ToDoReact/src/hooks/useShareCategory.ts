import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

type ShareCategoryData = {
  categoryId: string;
  userEmail: string;
  role: "owner" | "editor" | "viewer";
};

export function useShareCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ShareCategoryData) => {
      const response = await fetch(`${API_URL}/api/categorias/${data.categoryId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userEmail: data.userEmail,
          role: data.role
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al compartir tablero');
      }

      return response.json();
    },
    onSuccess: () => {
      // Refrescar lista de categorías para mostrar cambios
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}