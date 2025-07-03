import { useSettingsStore } from '../stores/settingsStore';

// Hook para manejar la vista de configuraciones desde cualquier parte de la app
export function useSettingsModal() {
  const isOpen = useSettingsStore(state => state.isOpen);
  const openSettings = useSettingsStore(state => state.openSettings);
  const closeSettings = useSettingsStore(state => state.closeSettings);

  return {
    isOpen,
    openSettings,
    closeSettings
  };
}
