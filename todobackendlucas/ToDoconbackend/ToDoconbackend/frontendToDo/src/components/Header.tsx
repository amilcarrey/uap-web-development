import { Link } from "react-router";
import { FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

export const Header = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Has cerrado sesión correctamente");
  };

  return (
    <header className="bg-gradient-to-r from-black via-[#333] to-gray-700 shadow-xl py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow flex items-center">
            <span className="pr-2">Tareas</span>
            <span className="bg-orange-400 text-black rounded-xl px-3 py-1 font-black text-lg shadow-sm group-hover:bg-orange-100 transition">
              hub
            </span>
          </h1>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Información del usuario */}
          <div className="flex items-center gap-2 text-white">
            <FaUser className="w-4 h-4" />
            <span className="text-sm font-medium">{user?.nombre}</span>
          </div>
          
          {/* Configuración */}
          <Link
            to="/settings"
            className="relative group"
            title="Configuración"
            aria-label="Configuración"
          >
            <FaCog className="w-7 h-7 text-white drop-shadow-sm group-hover:animate-spin group-hover:text-gray-800 transition" />
            <span className="absolute -top-1.5 -right-2 bg-white text-orange-500 text-xs px-2 py-0.5 rounded-full shadow group-hover:bg-orange-100 transition opacity-0 group-hover:opacity-100">
              Config
            </span>
          </Link>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="relative group"
            title="Cerrar Sesión"
            aria-label="Cerrar Sesión"
          >
            <FaSignOutAlt className="w-6 h-6 text-white drop-shadow-sm group-hover:text-red-400 transition" />
            <span className="absolute -top-1.5 -right-2 bg-white text-red-500 text-xs px-2 py-0.5 rounded-full shadow group-hover:bg-red-100 transition opacity-0 group-hover:opacity-100">
              Salir
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
