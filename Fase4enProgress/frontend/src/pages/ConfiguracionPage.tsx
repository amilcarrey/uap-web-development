// src/pages/ConfiguracionPage.tsx
import React, { useState, useEffect } from "react";
import { useUserPreferences } from "../hooks/useUserPreferences";
import { useActualizarUserPreferences } from "../hooks/useActualizarUserPreferences";

const ConfiguracionPage = () => {
  const { data: prefs, isLoading } = useUserPreferences();
  const actualizarPrefs = useActualizarUserPreferences();

  const [capitalizeTasks, setCapitalizeTasks] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60000);

  useEffect(() => {
    if (prefs) {
      setCapitalizeTasks(prefs.capitalizeTasks);
      setRefreshInterval(prefs.refreshInterval);
    }
  }, [prefs]);

  const handleGuardar = () => {
    actualizarPrefs.mutate({ capitalizeTasks, refreshInterval });
  };

  if (isLoading) return <p className="text-center">Cargando configuración...</p>;

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">Configuración del Usuario</h1>

      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={capitalizeTasks}
            onChange={(e) => setCapitalizeTasks(e.target.checked)}
          />
          Descripción en MAYÚSCULAS
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Intervalo de actualización automática (ms):
        </label>
        <input
          type="number"
          min={1000}
          step={1000}
          value={refreshInterval}
          onChange={(e) => setRefreshInterval(Number(e.target.value))}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <button
        onClick={handleGuardar}
        disabled={actualizarPrefs.status === "pending"}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {actualizarPrefs.status === "pending" ? "Guardando..." : "Guardar Cambios"}
      </button>

      {actualizarPrefs.status === "error" && (
        <p className="text-red-600 mt-2">Error al guardar los cambios.</p>
      )}
      {actualizarPrefs.status === "success" && (
        <p className="text-green-600 mt-2">Cambios guardados correctamente.</p>
      )}

      {/* DEBUG opcional */}
      {/* <pre>{JSON.stringify(prefs, null, 2)}</pre> */}
    </div>
  );
};

export default ConfiguracionPage;
