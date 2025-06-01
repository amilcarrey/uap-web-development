import { useMutation, useQueryClient } from "@tanstack/react-query";

// Función helper para obtener ID del tablero
const getTableroIdFromAlias = async (alias: string | undefined): Promise<string> => {
  if (!alias) return "tb-1"; // fallback
  
  try {
    const response = await fetch(`http://localhost:4321/api/tablero/${alias}`);
    if (response.ok) {
      const data = await response.json();
      return data.tablero.id;
    }
  } catch (error) {
    console.error('Error al obtener tablero:', error);
  }
  
  return "tb-1"; // fallback
};

export function useEliminarCompletadas(tableroAlias: string | undefined) { // 👈 AGREGAR: Parámetro tableroAlias
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // 👈 AGREGAR: Obtener el ID del tablero usando el alias
      const idTablero = await getTableroIdFromAlias(tableroAlias);
      
      const res = await fetch("http://localhost:4321/api/eliminarCompletadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idTablero }), // 👈 AGREGAR: Enviar idTablero
      });

      if (!res.ok) {
        throw new Error("No se pudieron eliminar las tareas completadas.");
      }

      const data = await res.json();

      if (!Array.isArray(data.idsEliminados)) {
        throw new Error("Respuesta inválida del servidor. Faltan los 'idsEliminados'.");
      }

      return data.idsEliminados as number[];
    },
    onSuccess: () => {
      // Invalidar queries para que se recarguen las tareas
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });
}