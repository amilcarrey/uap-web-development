import { useSettingsStore } from '../stores/settingsStore';

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
