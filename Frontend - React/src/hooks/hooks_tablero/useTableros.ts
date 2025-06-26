import { useQuery } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { fetchAuth } from '../../utils/fetchAuth';

/**
 * Hook para obtener la lista de tableros del usuario autenticado.
 */
export function useTableros() {
  const { token, logout } = useAuth();
  const { settings } = useSettings();

  return useQuery({
    queryKey: ['tableros'],
    queryFn: async () => {
      if (!token) throw new Error('No autenticado');

      const res = await fetchAuth(
        `${API_URL}/api/tableros/get`,
        { method: 'GET' },
        logout
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error al obtener tableros:", errorText);
        throw new Error(errorText || 'Error al obtener los tableros');
      }
      
      const data = await res.json();

      console.log(data);
      console.log("Consultado: Tableros ✅");

      return data ?? [];
    },
    // Intervalo para volver a consultar los tableros, configurable desde settings
    refetchInterval: settings?.refetchInterval ?? 10000,
  });
}
