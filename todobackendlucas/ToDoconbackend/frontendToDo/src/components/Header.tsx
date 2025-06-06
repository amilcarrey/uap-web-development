import { Link } from "react-router";
import { FaCog } from "react-icons/fa";

export const Header = () => {
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
      </div>
    </header>
  );
};
