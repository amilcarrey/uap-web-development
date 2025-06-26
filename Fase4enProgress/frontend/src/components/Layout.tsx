// src/components/Layout.tsx
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/useLogout";

type Tablero = { id: string; title: string };

const Layout = () => {
  const user = useAuthStore((s) => s.user);
  const logoutLocal = useAuthStore((s) => s.logout);
  const logout = useLogout();
  const navigate = useNavigate();
  const { tableroId } = useParams();

  const { data: tableros = [] } = useQuery<Tablero[]>({
    queryKey: ["tableros"],
    queryFn: async () => {
      const res = await fetch("http://localhost:4000/api/boards", {
        credentials: "include",
      });
      return res.json();
    },
  });

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        logoutLocal(); 
        window.location.href = "/login"; 
      },
    });
  };


  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4 relative">
      {/* HEADER */}
      <header className="p-4 bg-gray-100 flex justify-between">
        <div>To-Do App</div>
        {user && (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline"
          >
            Cerrar sesión
          </button>
        )}
      </header>

      {/* NAVEGACIÓN DE TABLEROS */}
      <nav className="flex gap-4 justify-center mb-4">
        {tableros.map((tab) => (
          <Link
            key={tab.id}
            to={`/tablero/${tab.id}`}
            className={`px-3 py-1 rounded ${
              tableroId === tab.id
                ? "bg-blue-600 text-white"
                : "text-blue-600 hover:underline"
            }`}
          >
            {tab.title}
          </Link>
        ))}
      </nav>

      {/* BOTÓN ADMIN */}
      <Link
        to="/admin"
        className="absolute top-4 right-4 bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition-colors"
      >
        ⚙️ Gestionar tableros
      </Link>

      <Outlet />
    </div>
  );
};

export default Layout;
