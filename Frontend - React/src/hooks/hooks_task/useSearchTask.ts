import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../../components/TaskManager';
import { useAuth } from '../../context/AuthContext';
import { useTaskStore } from '../../store';
import { fetchAuth } from '../../utils/fetchAuth';

export function useSearchTasks(
  query: string,
  filter: 'all' | 'complete' | 'incomplete',
  page: number,
  limit: number,
  tableroId: number | null,
  refetchInterval: number
) {
  const { token, logout } = useAuth();
  const setTasks = useTaskStore((state) => state.setTasks);

  return useQuery({
    queryKey: ['tasks', query, filter, page, limit, tableroId],
    queryFn: async () => {
      if (!token) throw new Error('No autenticado');
      if (tableroId === null) throw new Error('TableroId inválido');

      const params = new URLSearchParams({
        filter,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (query.trim() !== '') {
        params.append('query', query.trim());
      }

      // Elegir endpoint según si hay texto de búsqueda o no
      const endpoint =
        query.trim() === ''
          ? `${API_URL}/api/tareas/getFiltered/${tableroId}`
          : `${API_URL}/api/tareas/search/${tableroId}`;

      console.log(`Llamando endpoint: ${endpoint}?${params.toString()}`);

      const res = await fetchAuth(
        `${endpoint}?${params.toString()}`,
        {
          method: 'GET',
        },
        logout
      );

      if (!res.ok) throw new Error('Error al obtener tareas');

      const data = await res.json();
      const tareas = data.data ?? [];

      setTasks(tareas);

      return {
        data: tareas,
        totalPages: data.totalPages ?? 1,
        total: data.total ?? 0,
      };
    },
    enabled: tableroId !== null && !!token,
    refetchInterval: tableroId !== null ? refetchInterval : false,
  });
}
