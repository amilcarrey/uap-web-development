//src\components\FilterControls.tsx
import { UserProfileDropdown } from './UserProfileDropdown';
import { useAuthStore } from '../stores/authStore';

/**
 * Componente Header
 * Muestra el encabezado principal de la aplicación con título y dropdown de usuario.
 */
export function Header() {
  const user = useAuthStore(state => state.user);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-800">
              📋 Task Manager
            </h1>
          </div>

          {/* Usuario autenticado */}
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:block">
                ¡Hola, {user.alias}!
              </span>
              <UserProfileDropdown />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
