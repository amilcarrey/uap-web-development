import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext"; 

const ConfiguracionPanel: React.FC = () => {
  const navigate = useNavigate();
  const { settings, loading, error, updateSettings } = useSettings();

  // Estados locales para los controles de configuración
  const [refetchInterval, setRefetchInterval] = useState(10000);
  const [descripcionMayusculas, setDescripcionMayusculas] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [saving, setSaving] = useState(false);

  // Cuando cambian las configuraciones desde el contexto, sincronizamos con los estados locales
  useEffect(() => {
    if (settings) {
      setRefetchInterval(settings.refetchInterval ?? 10000);
      setDescripcionMayusculas(settings.descripcionMayusculas ?? false);
      setIsDark(settings.theme === "dark");
    }
  }, [settings]);

  // Aplicar o quitar clase 'dark' en el documento para cambiar el tema visual
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  // Guardar la configuración actual llamando al contexto
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        refetchInterval,
        descripcionMayusculas,
        theme: isDark ? "dark" : "light",
      });
      alert("Configuración guardada");
    } catch {
      alert("Error guardando configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando configuración...</p>;
  if (error) return <p>Error al cargar configuración: {error}</p>;

  return (
    <section className="p-4 border rounded bg-orange-100 dark:bg-gray-800 min-h-screen">
      <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
        Configuración
      </h2>

      {/* Intervalo de actualización */}
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

      {/* Checkbox para mostrar descripciones en mayúsculas */}
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

      {/* Botones para cambiar tema, guardar y volver */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsDark((prev) => !prev)}
          className="bg-gray-200 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded shadow"
        >
          {isDark ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          {saving ? "Guardando..." : "Guardar Configuración"}
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
