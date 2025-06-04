import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ConfiguracionPanel: React.FC = () => {
  const navigate = useNavigate();

  // Leer el estado guardado en localStorage o valores por defecto
  const [refetchInterval, setRefetchInterval] = useState(() => {
    const saved = localStorage.getItem("refetchInterval");
    return saved ? Number(saved) : 10000;
  });

  const [descripcionMayusculas, setDescripcionMayusculas] = useState(() => {
    const saved = localStorage.getItem("descripcionMayusculas");
    return saved ? JSON.parse(saved) : false;
  });

  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Sincronizar configuración con localStorage
  useEffect(() => {
    localStorage.setItem("refetchInterval", refetchInterval.toString());
  }, [refetchInterval]);

  useEffect(() => {
    localStorage.setItem("descripcionMayusculas", JSON.stringify(descripcionMayusculas));
  }, [descripcionMayusculas]);

  // Sincronizar tema con localStorage y el DOM
  useEffect(() => {
    const root = window.document.documentElement;

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <section className="p-4 border rounded bg-orange-100 dark:bg-gray-800 min-h-screen">
      <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
        Configuración
      </h2>

      <div className="mb-4">
        <label className="block mb-1 font-semibold text-black dark:text-white">
          Intervalo de actualización (segundos):
        </label>
        <input
          type="number"
          value={refetchInterval / 1000}
          min={1}
          onChange={(e) => setRefetchInterval(Number(e.target.value) * 1000)}
          className="p-2 rounded border w-full dark:text-black"
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 font-semibold text-black dark:text-white">
          <input
            type="checkbox"
            checked={descripcionMayusculas}
            onChange={(e) => setDescripcionMayusculas(e.target.checked)}
          />
          Mostrar descripciones en MAYÚSCULAS
        </label>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={toggleTheme}
          className="bg-gray-200 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded shadow"
        >
          {isDark ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Volver a Inicio
        </button>
      </div>
    </section>
  );
};

export default ConfiguracionPanel;
