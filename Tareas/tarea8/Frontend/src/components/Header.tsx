import { UserProfileDropdown } from './UserProfileDropdown';
import { SettingsButton, SettingsModal, useSettingsModal } from './SettingsModal';
import { useAuthStore } from '../stores/authStore';

/**
 * Header
 * Main app header with access to user settings and profile dropdown.
 */
export function Header() {
  const user = useAuthStore(state => state.user);
  const { isOpen, openSettings, closeSettings } = useSettingsModal();

  return (
    <header className="bg-white border-b border-black-500">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-left justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-indigo-700 tracking-tight">
              TO DO List ✅
            </h1>
          </div>

          {user && (
            <div className="flex items-center space-x-16">
              <SettingsButton 
                onOpenSettings={openSettings} 
                variant="icon"
                className="hidden sm:block"
              />
              <UserProfileDropdown />
            </div>
          )}
        </div>
      </div>

      <SettingsModal isOpen={isOpen} onClose={closeSettings} />
    </header>
  );
}
