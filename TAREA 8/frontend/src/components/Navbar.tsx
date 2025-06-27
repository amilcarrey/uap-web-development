import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_EMAIL } from '../config/constants';

const Navbar: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y navegación */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-blue-600">
                TaskBoard
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-900 hover:text-blue-600 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/configuracion"
                className="text-gray-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors"
              >
                Configuración
              </Link>
              {/* Solo mostrar Admin para Juan Pérez */}
              {usuario?.email === ADMIN_EMAIL && (
                <Link
                  to="/admin"
                  className="text-gray-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Usuario y logout */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 text-sm">
              Hola, <span className="font-medium">{usuario?.nombre}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
