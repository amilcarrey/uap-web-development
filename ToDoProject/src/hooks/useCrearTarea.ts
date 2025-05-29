import { useMutation, useQueryClient } from '@tanstack/react-query';

export type Tarea = {
  id: number;
  descripcion: string;
  completada: boolean;
};

type NuevaTarea = {
  descripcion: string;
};

export function useCrearTarea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ descripcion }: NuevaTarea): Promise<Tarea> => {
      const res = await fetch('http://localhost:4321/api/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion }),
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