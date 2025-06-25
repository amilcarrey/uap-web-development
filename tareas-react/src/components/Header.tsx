import React, { useEffect } from "react";
import { Link, useMatch, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaCog } from "react-icons/fa";

import { tableroRoute } from "../routes/routes";
import { useUIStore } from "./store/useUIstore";
import { useNotificacionesStore } from "./store/useNotificacionesStore";
import { useTableros } from "./hooks/useTableros";
import { useAuthStatus } from "./hooks/useAuthStatus";
import { useCrearTablero } from "./hooks/useCrearTablero";
import { useDeleteTablero } from "./hooks/useDeleteTablero";

type Tablero = {
  id: string;
  nombre: string;
};

const Header = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn, nombre } = useAuthStatus();
  const { data: tableros = [] } = useTableros();
  const crearTableroMutation = useCrearTablero();
  const deleteTableroMutation = useDeleteTablero(tableros);
  const navigate = useNavigate();

  // Zustand: store de UI y notificaciones
  const setTableroActivo = useUIStore((s) => s.setTableroActivo);
  const tableroActivoStore = useUIStore((s) => s.tableroActivo);
  const { agregar: notificar } = useNotificacionesStore();

  // Obtener el tablero activo desde la URL
  const match = useMatch({ to: tableroRoute.id });
  const tableroActivo = match?.params.tableroId ?? tableroActivoStore;

  // Sincronizar el store con la URL
  useEffect(() => {
    setTableroActivo(tableroActivo);
  }, [tableroActivo, setTableroActivo]);

  const handleLogout = async () => {
    await axios.post("http://localhost:8008/api/auth/logout", {}, { withCredentials: true });
    window.location.reload(); // Para refrescar el estado de sesión
  };

  return (
    <header className="border-white backdrop-blur-md bg-white/70 bg-white border-opacity-20 text-gray-800 w-full z-50 p-4 fixed top-0 left-0 text-center shadow-sm h-[80px] flex flex-col justify-center respiro-static">
      {/* Saludo a la izquierda */}
      {isLoggedIn && (
        <span className="absolute left-6 top-6 text-gray-700 font-semibold flex items-center gap-2">
          Hola, {nombre}
          <Link to="/configuracion" title="Configuración">
            <FaCog className="inline-block text-xl hover:text-blue-500 transition cursor-pointer" />
          </Link>
        </span>
      )}

      {/* Cambia esto: */}
      <Link to="/" className="text-xl font-light tracking-wide select-none hover:underline transition cursor-pointer">
        2.DO
      </Link>

      <nav className="flex justify-center mt-2 space-x-4">
        {isLoggedIn && tableros.map((t: Tablero) => (
          <div key={t.id} className="relative group flex items-center space-x-1">
            <Link
              to={`/tablero/${t.id}`}
              className={`text-sm transition-colors duration-200 font-light ${
                tableroActivo === t.id
                  ? "text-black font-semibold underline"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {t.nombre}
            </Link>
            <button
              onClick={() => deleteTableroMutation.mutate(t.id)}
              className="text-red-400 hover:text-red-600 text-xs ml-1 transition-opacity duration-150 opacity-0 group-hover:opacity-100"
              title="Eliminar tablero"
              type="button"
            >
              🗑️
            </button>
          </div>
        ))}
        {/* Botón para crear tablero solo si está logueado */}
        {isLoggedIn && (
          <button
            onClick={() => {
              const nombre = prompt("Nombre del nuevo tablero:");
              if (nombre) crearTableroMutation.mutate(nombre);
            }}
            className="text-gray-400 hover:text-blue-500 text-xl font-semibold"
            title="Agregar tablero"
            type="button"
          >
            +
          </button>
        )}
      </nav>
      {/* Logout a la derecha */}
      <nav className="flex -mt-1 space-x-4 absolute right-6 top-6">
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border border-white bg-gradient-to-r text-black shadow-md backdrop-blur-md transition hover:scale-105"
              style={{
                background:
                  "linear-gradient(0deg,rgb(243, 244, 246),rgb(239, 239, 239) 100%)",
                border: "1.5px solid rgba(255,255,255,0.7)",
                boxShadow: "0 4px 24px 0 rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className=" px-4 py-2 rounded-lg bg-black text-white border border-white ml-2 shadow-md transition hover:bg-gray-900"
            style={{
                background:
                  "linear-gradient(0deg,rgb(41, 41, 41),rgb(0, 0, 0) 100%)",
                border: "1.5px solid rgba(255,255,255,0.7)",
                boxShadow: "0 4px 24px 0 rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              Registrarse
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold shadow transition hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;