import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/stores/userStore';
import { useEffect } from 'react';

export interface Tablero {
  id: string;
  nombre: string;
  propietarioId: string;
}

export type RolTablero = 'propietario' | 'editor' | 'lectura';

export interface TableroExtendido extends Tablero {
  rol: RolTablero;
}


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useTableros() {
  const queryClient = useQueryClient();
  const token = useUserStore((state) => state.usuario?.token); // 👈 token del estado global

  // 🔁 Refresca los tableros cuando aparece un token
  useEffect(() => {
    if (token) {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    }
  }, [token, queryClient]);

  const fetchTableros = async (): Promise<TableroExtendido[]> => {
  console.log('Token usado en fetchTableros:', token);

  const res = await fetch(`${API_URL}/api/tableros`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudieron cargar los tableros');
  return res.json();
};


  const crearTablero = useMutation({
    mutationFn: async (nombre: string) => {
      const res = await fetch(`${API_URL}/api/tableros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre }),
      });

      if (!res.ok) throw new Error('Error al crear el tablero');

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
  });

  const eliminarTablero = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/tableros/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Error al eliminar el tablero');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
  });

  const compartirTablero = useMutation({
    mutationFn: async ({
      tableroId,
      email,
      rol,
    }: {
      tableroId: string;
      email: string;
      rol: 'propietario' | 'editor' | 'lectura';
    }) => {
      const res = await fetch(`${API_URL}/api/tableros/${tableroId}/compartir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, rol }),
      });

      if (!res.ok) throw new Error('Error al compartir el tablero');

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
  });


  const { data: tableros, isLoading } = useQuery<TableroExtendido[]>({
    queryKey: ['tableros'],
    queryFn: fetchTableros,
    enabled: !!token,
  });


  return { tableros, crearTablero, eliminarTablero, isLoading };
}

