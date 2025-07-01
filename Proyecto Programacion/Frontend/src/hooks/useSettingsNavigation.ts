import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Hook para manejar la navegación de configuraciones
export function useSettingsNavigation() {
  const [activeTab, setActiveTab] = useState(() => {
    // Recuperar tab activa del localStorage si existe
    return localStorage.getItem('settings-active-tab') || 'profile';
  });

  // Guardar la tab activa en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('settings-active-tab', activeTab);
  }, [activeTab]);

  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  return {
    activeTab,
    navigateToTab,
    setActiveTab
  };
}

// Hook para manejar atajos de teclado en configuraciones
export function useSettingsKeyboardShortcuts(
  tabs: Array<{ id: string; label: string }>,
  navigateToTab: (tabId: string) => void
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Solo si se presiona Ctrl/Cmd + número
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey) {
        const num = parseInt(event.key);
        if (num >= 1 && num <= tabs.length) {
          event.preventDefault();
          const targetTab = tabs[num - 1];
          navigateToTab(targetTab.id);
          toast.success(`Navegando a ${targetTab.label}`, { 
            duration: 1000,
            icon: '⌨️'
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [tabs, navigateToTab]);
}

// Hook para detectar cambios no guardados
export function useUnsavedChanges() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges
  };
}
