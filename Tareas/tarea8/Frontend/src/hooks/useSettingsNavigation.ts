import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSettingsStore } from '../stores/settingsStore';

// Hook para manejar la navegación de configuraciones
export function useSettingsNavigation() {
  // Usar el activeTab del store global en lugar de estado local
  const globalActiveTab = useSettingsStore(state => state.activeTab);
  
  // Si no hay tab global, usar el del localStorage o 'profile' por defecto
  const activeTab = globalActiveTab || localStorage.getItem('settings-active-tab') || 'profile';

  const navigateToTab = (tabId: string) => {
    console.log('🔄 [useSettingsNavigation] Navegando a tab:', tabId);
    
    // Guardar en localStorage
    localStorage.setItem('settings-active-tab', tabId);
    
    // Actualizar el store global también
    useSettingsStore.getState().openSettings(tabId);
  };

  return {
    activeTab,
    navigateToTab
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
