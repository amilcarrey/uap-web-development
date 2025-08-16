'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  currentUser: string;
  onLogout: () => void;
}

export default function DashboardHeader({ currentUser, onLogout }: DashboardHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const router = useRouter();

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setShowMenu(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setShowMenu(false);
  };

  // Inicializar modo oscuro al cargar
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
  }, [darkMode]);

  // Generar iniciales del usuario
  const initials = currentUser
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/dashboard" className="text-2xl font-light text-black">
          ReviewOffBooks
        </Link>

                 {/* Navegación - Removida */}

        {/* Avatar y menú */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <span className="text-gray-600 text-sm hidden md:block">
              Hola, {currentUser}
            </span>
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
              {initials}
            </div>
          </button>

          {/* Menú desplegable */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {initials}
                  </div>
                  <div>
                    <p className="font-medium text-black">{currentUser}</p>
                    <p className="text-sm text-gray-500">
                      {localStorage.getItem('userEmail') || 'usuario@ejemplo.com'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  👤 Mi Perfil
                </button>
                
                <button
                  onClick={toggleDarkMode}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {darkMode ? '☀️' : '🌙'} Modo {darkMode ? 'Claro' : 'Oscuro'}
                </button>

                <div className="border-t border-gray-200 my-2"></div>

                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para cerrar menú */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </header>
  );
}
