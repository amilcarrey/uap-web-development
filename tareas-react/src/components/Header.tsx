import React, { useEffect } from "react";
import axios from "axios";
import { Link, useMatch, useNavigate, useRouter } from "@tanstack/react-router";
import { FaCog } from "react-icons/fa";
import { tableroRoute } from "../routes/routes";
import { useUIStore } from "./store/useUIstore";
import { useNotificacionesStore } from "./store/useNotificacionesStore";
import { useTableros } from "./hooks/useTableros";
import { useAuthStatus } from "./hooks/useAuthStatus";
import { useFondoStore } from "./store/useFondoStore";
import { useConfigStore } from "./store/useConfigStore";
import { useTableroAction } from "./hooks/useTableroAction";

type Tablero = {
  id: string;
  nombre: string;
};

const Header = () => {
  const { isLoggedIn, nombre } = useAuthStatus();
  const { data: tableros = [] } = useTableros();
  const navigate = useNavigate();
  const { state } = useRouter();
  const { agregar: notificar } = useNotificacionesStore();
  const tableroAction = useTableroAction(notificar);

  // Zustand: store de UI y notificaciones
  const setTableroActivo = useUIStore((s) => s.setTableroActivo);
  const tableroActivoStore = useUIStore((s) => s.tableroActivo);
  const setFondoUrl = useFondoStore((s) => s.setFondoUrl);

  // Obtener el tablero activo desde la URL
  const match = useMatch({ to: tableroRoute.id });
  const tableroActivo = match?.params.tableroId ?? tableroActivoStore;

  // Saber si estamos en /tableros (HomeTableros)
  const matchHomeTableros = state.location.pathname === "/tableros";

  useEffect(() => {
    setTableroActivo(tableroActivo);
  }, [tableroActivo, setTableroActivo]);

  const handleLogout = async () => {
    await axios.post("http://localhost:8008/api/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("config");
    localStorage.removeItem("fondoUrl");
    useConfigStore.getState().setIntervaloRefetch(10000);
    useConfigStore.getState().setDescripcionMayusculas(false);
    useConfigStore.getState().setTareasPorPagina(3);
    useFondoStore.getState().setFondoUrl("");
    navigate({ to: "/" });
    setTimeout(() => window.location.reload(), 50);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate({ to: "/tableros" });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <header className="border-white backdrop-blur-md border-opacity-20 text-gray-800 w-full z-50 p-4 fixed top-0 left-0 text-center shadow-sm h-[80px] flex flex-col justify-center respiro-static">
      {/* Saludo a la izquierda */}
      {isLoggedIn && (
        <span className="absolute left-6 top-6 text-gray-100 font-semibold flex items-center gap-2">
          Bienvenido, {nombre}
          <Link to="/configuracion" title="Configuración">
            <FaCog className="inline-block text-xl hover:text-blue-500 transition cursor-pointer" />
          </Link>
        </span>
      )}

      {/* Logo 2.DO con navegación condicional */}
      <a
        href={isLoggedIn ? "/tableros" : "/"}
        onClick={handleLogoClick}
        className="text-xl text-white font-light tracking-wide select-none hover:underline transition cursor-pointer"
      >
        2.DO
      </a>

      {/* Barra de tableros: solo si NO estamos en /tableros */}
      {isLoggedIn && !matchHomeTableros && (
        <nav className="flex justify-center mt-2 space-x-4">
          {tableros.map((t: Tablero) => (
            <div key={t.id} className="relative group flex items-center space-x-1">
              <Link
                to={`/tablero/${t.id}`}
                className={`text-sm transition-colors duration-200 font-light ${
                  tableroActivo === t.id
                    ? "text-gray-900 font-semibold underline text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {t.nombre}
              </Link>
              <button
                onClick={() => {
                  if (window.confirm("¿Seguro que deseas borrar este tablero?")) {
                    tableroAction.mutate({ type: "delete", id: t.id });
                  }
                }}
                className="text-red-400 hover:text-red-600 text-xs ml-1 transition-opacity duration-150 opacity-0 group-hover:opacity-100"
                title="Eliminar tablero"
                type="button"
              >
                🗑️
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const nombre = prompt("Nombre del nuevo tablero:");
              if (nombre) tableroAction.mutate({ type: "create", nombre });
            }}
            className="text-gray-400 hover:text-blue-500 text-xl font-semibold"
            title="Agregar tablero"
            type="button"
          >
            +
          </button>
        </nav>
      )}

      {/* Logout a la derecha */}
      <nav className="flex -mt-1 space-x-4 absolute right-6 top-6">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold shadow transition hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        ) : null}
      </nav>
    </header>
  );
};

export default Header;

