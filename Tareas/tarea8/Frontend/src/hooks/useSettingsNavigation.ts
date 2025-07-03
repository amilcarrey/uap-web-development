import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSettingsStore } from '../stores/settingsStore';

export function useSettingsNavigation() {
  const globalActiveTab = useSettingsStore((s) => s.activeTab);
  const activeTab = globalActiveTab || localStorage.getItem('settings-active-tab') || 'profile';

  const navigateToTab = (tabId: string) => {
    localStorage.setItem('settings-active-tab', tabId);
    useSettingsStore.getState().openSettings(tabId);
  };

  return { activeTab, navigateToTab };
}

export function useSettingsKeyboardShortcuts(
  tabs: Array<{ id: string; label: string }>,
  navigateToTab: (tabId: string) => void
) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey) {
        const num = parseInt(event.key);
        if (num >= 1 && num <= tabs.length) {
          event.preventDefault();
          const target = tabs[num - 1];
          navigateToTab(target.id);
          toast.success(`Switched to ${target.label}`, {
            duration: 1000,
            icon: '🔁',
          });
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tabs, navigateToTab]);
}

export function useUnsavedChanges() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [hasUnsavedChanges]);

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges,
  };
}
