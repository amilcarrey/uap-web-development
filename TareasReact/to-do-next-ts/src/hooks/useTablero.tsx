// hooks/useTablero.ts
'use client';

import { useQuery } from '@tanstack/react-query';

const API = process.env.NEXT_PUBLIC_API_URL!;

export const useTablero = (tableroId: string) => {
  return useQuery({
    queryKey: ['tablero', tableroId],
    queryFn: async () => {
      const res = await fetch(`${API}/tableros/${tableroId}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Error al obtener el tablero');
      }

      return res.json(); // deberías devolver un solo objeto { id, nombre }
    },
    enabled: !!tableroId, // solo corre si hay id
  });
};
