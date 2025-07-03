import { Link } from "react-router-dom";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Error ya manejado en el contexto
    }
  };

  if (!isAuthenticated) return null;

  return (
    <header className="bg-blend-hue text-white p-4 text-center shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/dashboard">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-blue-400">Atareado</span>.com
          </h1>
        </Link>

        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-gray-600 text-sm">Hola, {user.username}</span>
          )}

          <Link
            to="/settings"
            className="text-gray-800 hover:text-blue-500 transition-colors duration-300"
            title="Configuraciones"
          >
            <FaCog className="inline-block" />
          </Link>

          <button
            onClick={handleLogout}
            className="text-gray-800 hover:text-red-500 transition-colors duration-300"
            title="Cerrar sesión"
          >
            <FaSignOutAlt className="inline-block" />
          </button>
        </div>
      </div>
    </header>
  );
};
