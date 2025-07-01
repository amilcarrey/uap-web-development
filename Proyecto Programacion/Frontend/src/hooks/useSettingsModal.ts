import { useState } from 'react';

// Hook para manejar la vista de configuraciones desde cualquier parte de la app
export function useSettingsModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openSettings = (tab?: string) => {
    if (tab) {
      localStorage.setItem('settings-active-tab', tab);
    }
    setIsOpen(true);
  };

  const closeSettings = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openSettings,
    closeSettings
  };
}
