// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSettings } from '../store/useStore';
import NavTableros from '../components/NavTableros';

export default function SettingsPage() {
  const {
    refetchInterval,
    uppercase,
    setRefetchInterval,
    toggleUppercase,
  } = useSettings();

  const [intervalInput, setIntervalInput] = useState(refetchInterval / 1000);

  useEffect(() => {
    setIntervalInput(refetchInterval / 1000);
  }, [refetchInterval]);

  function handleIntervalChange(e) {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setIntervalInput(value);
    }
  }

  function handleSaveInterval() {
    setRefetchInterval(intervalInput * 1000);
  }

  function handleToggleUppercase() {
    toggleUppercase();
  }

  return (
    <div className="py-8 bg-amber-50 min-h-screen">
      <div className="max-w-xl mx-auto">
        <NavTableros />

        <h2 className="text-xl font-semibold mb-4 text-center">Configuraciones</h2>

        <div className="bg-white p-6 rounded shadow mb-6">
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Intervalo de Refetch (segundos):
            </label>
            <input
              type="number"
              min="1"
              value={intervalInput}
              onChange={handleIntervalChange}
              className="border p-2 rounded w-24"
            />
            <button
              onClick={handleSaveInterval}
              className="ml-4 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
            >
              Guardar
            </button>
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={handleToggleUppercase}
              className="mr-2"
            />
            <label>Mostrar tareas en mayúsculas</label>
          </div>

          <p className="text-gray-600 text-sm">
            Al activar “Mayúsculas”, todos los títulos de tareas se mostrarán en mayúsculas.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:underline"
          >
            ← Volver al tablero
          </button>
        </div>
      </div>
    </div>
  );
}
