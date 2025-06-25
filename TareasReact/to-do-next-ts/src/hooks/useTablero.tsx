// hooks/useTablero.ts
'use client';

import { useQuery } from '@tanstack/react-query';

const API = process.env.NEXT_PUBLIC_API_URL!;

// hook para traer info de un tablero por id
export const useTablero = (tableroId: string) => {
  return useQuery({
    queryKey: ['tablero', tableroId], // clave para cache/query
    queryFn: async () => {
      // pido el tablero al backend
      const res = await fetch(`${API}/tableros/${tableroId}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Error al obtener el tablero');
      }

      // devuelvo el objeto del tablero
      return res.json();
    },
    enabled: !!tableroId, // solo corre si hay id
  });
};
