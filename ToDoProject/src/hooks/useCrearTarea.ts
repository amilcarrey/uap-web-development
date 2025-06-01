import { useMutation, useQueryClient } from '@tanstack/react-query';

export type Tarea = {
  id: number;
  descripcion: string;
  completada: boolean;
};

type NuevaTarea = {
  descripcion: string;
};

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

export function useCrearTarea(tableroAlias: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ descripcion }: NuevaTarea): Promise<Tarea> => {
      // 👈 AGREGAR: Obtener el ID del tablero usando el alias
      const idTablero = await getTableroIdFromAlias(tableroAlias);
      
      const res = await fetch('http://localhost:4321/api/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          descripcion, 
          idTablero // 👈 AGREGAR: Enviar idTablero al backend
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Error al agregar tarea');
      }

      const data = await res.json();
      if (!data.tarea) {
        throw new Error('La respuesta del servidor no es válida.');
      }

      return data.tarea;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });
}