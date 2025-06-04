import { Outlet } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSettingsStore } from "../store/useSettingsStore";

export const Layout = () => {
  const refetchInterval = useSettingsStore((state) => state.refetchInterval);
  const [countdown, setCountdown] = useState(refetchInterval / 1000);

  useEffect(() => {
    setCountdown(refetchInterval / 1000);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return refetchInterval / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refetchInterval]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white p-4 text-center">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">TO-DO</h1>
          <div className="flex gap-4">
            <Link to="/" className="text-white hover:text-gray-200">
              Inicio
            </Link>
            <Link to="/settings" className="text-white hover:text-gray-200">
              ⚙️ Configuración
            </Link>
          </div>
        </div>
      </header>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "bg-gray-800 text-white",
          duration: 2000,
          style: {
            padding: "16px",
            borderRadius: "8px",
            fontSize: "16px",
          },
        }}
      />
      <main className="container mx-auto py-8 flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <span className="text-sm bg-blue-900 px-2 py-1 rounded justify-center">
              Próximo refetch: {countdown}s
            </span>
        <div className="text-center text-gray-400 py-4">
          <p>Kevin Stivala - Alumno 30928 - (Tarea 7)</p>
        </div>
      </footer>
    </div>
  );
};
