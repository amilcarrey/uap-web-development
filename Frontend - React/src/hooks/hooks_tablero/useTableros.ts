import { useQuery } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";

export function useTableros() {
  return useQuery({
    queryKey: ['tableros'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/tableros/get`);
      if (!res.ok) throw new Error('Error al obtener los tableros');
      const data = await res.json();
      return data ?? [];
    },
  });
}



