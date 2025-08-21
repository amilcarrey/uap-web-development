import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

// Tipo para las configuraciones
export interface UserSettings {
  uppercaseDescriptions: string;
  refetchInterval: string;
  tasksPerPage: string;
}

// traer las configuraciones
export function useUserSettings() {
  return useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/userSettings/`, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login';
          throw new Error('No autenticado');
        }
        throw new Error('Error al cargar configuraciones');
      }
      
      return res.json();
    },
    staleTime: 6 * 60 * 1000, // 6 minutos
  });
}

//actualizar muchas configuraciones
export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Partial<UserSettings>) => {
      const res = await fetch(`${API_URL}/api/userSettings/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar configuraciones');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    },
  });
}

//actualizar una configuración individual
export function useUpdateUserSetting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ settingKey, settingValue }: { settingKey: string; settingValue: string }) => {
      const res = await fetch(`${API_URL}/api/userSettings/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ settingKey, settingValue }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar configuración');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    },
  });
}

// reset configuraciones
export function useResetUserSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/userSettings/all`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al resetear configuraciones');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    },
  });
}