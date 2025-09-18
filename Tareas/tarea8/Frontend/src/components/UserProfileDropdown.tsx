import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useSettingsModal } from './SettingsModal';

export function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { openSettings } = useSettingsModal();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!user?.alias) return null;

  const avatarLetter = user.alias.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-indigo-100 transition-colors"
        title="Mi perfil"
      >
        <div className="w-9 h-9 border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 font-bold bg-white">
          {avatarLetter}
        </div>
        <span className="hidden md:block text-sm font-medium text-indigo-800">
          {user.alias}
        </span>
        <svg
          className={`w-4 h-4 text-indigo-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-indigo-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-indigo-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg bg-white">
                {avatarLetter}
              </div>
              <div>
                <p className="font-semibold text-indigo-900">{user.alias}</p>
                <p className="text-xs text-indigo-500">ID: {user.id}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                console.log('🛠️ [UserProfileDropdown] Preferencias');
                openSettings('preferences');
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              <span className="mr-3">🛠️</span>
              Preferencias
            </button>

            <button
              onClick={() => {
                console.log('👤 [UserProfileDropdown] Mi Perfil');
                openSettings('profile');
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              <span className="mr-3">👤</span>
              Mi Perfil
            </button>

            <button
              onClick={() => {
                console.log('🧩 [UserProfileDropdown] Configuración App');
                openSettings('application');
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              <span className="mr-3">🧩</span>
              Configuración App
            </button>
          </div>

          <div className="border-t border-indigo-100 my-1" />

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="mr-3">🚪</span>
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
