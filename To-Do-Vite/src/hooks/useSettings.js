import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserSettings, updateUserSettings } from '../config/api';
import useAppStore from '../stores/appStore';

// Query key para ajustes
export const settingsKeys = {
  all: ['settings'],
  user: () => [...settingsKeys.all, 'user'],
};

// Hook para obtener ajustes del usuario
export const useUserSettings = () => {
  return useQuery({
    queryKey: settingsKeys.user(),
    queryFn: getUserSettings,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};

// Hook para actualizar ajustes del usuario
export const useUpdateSettings = (showNotification = false) => {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();

  return useMutation({
    mutationFn: updateUserSettings,
    onSuccess: (data) => {
      // Actualizar el cache con los nuevos ajustes
      queryClient.setQueryData(settingsKeys.user(), data.settings);
      
      // Actualizar el store local
      useAppStore.getState().updateSettings(data.settings);
      
      // Solo mostrar notificación si se solicita
      if (showNotification) {
        addToast('Ajustes actualizados correctamente', 'success');
      }
    },
    onError: (error) => {
      if (showNotification) {
        addToast('Error al actualizar ajustes', 'error');
      }
      console.error('Error updating settings:', error);
    },
  });
}; 