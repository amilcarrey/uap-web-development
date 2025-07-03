import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToSettings = () => {
    navigate("/configuraciones"); // Cambia esta ruta si usas otra
  };

  return (
    <header className="w-full bg-white text-black flex justify-between items-center p-4 shadow-md">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/home")}
      >
        TARENEITOR
      </h1>
      <div className="flex items-center gap-4">
        {user && <span className="hidden sm:inline">Hola, {user.nombre_usuario}</span>}
        <button
          onClick={goToSettings}
          className="px-3 py-1 rounded hover:bg-gray-200"
          aria-label="Configuraciones"
          title="Configuraciones"
        >
          ⚙️
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
