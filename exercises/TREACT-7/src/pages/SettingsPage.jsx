// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { useToastStore } from '../stores/toastStore';

export default function SettingsPage() {
  const { refetchInterval, uppercase, setRefetchInterval, toggleUppercase } = useSettingsStore(
    (state) => ({
      refetchInterval: state.refetchInterval,
      uppercase: state.uppercase,
      setRefetchInterval: state.setRefetchInterval,
      toggleUppercase: state.toggleUppercase,
    })
  );
  const addToast = useToastStore((state) => state.addToast);

  const [localInterval, setLocalInterval] = useState(refetchInterval);
  const [localUppercase, setLocalUppercase] = useState(uppercase);

  // Cuando se monte, sincronizamos valores locales con el store
  useEffect(() => {
    setLocalInterval(refetchInterval);
    setLocalUppercase(uppercase);
  }, [refetchInterval, uppercase]);

  const handleSave = () => {
    setRefetchInterval(Number(localInterval));
    if (localUppercase !== uppercase) toggleUppercase();
    addToast({ message: 'Configuración guardada', type: 'success' });
  };

  return (
    <div className="py-8 bg-amber-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Configuraciones</h1>

        {/* 1) Intervalo de Refetch */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Intervalo de Refetch (segundos)</label>
          <input
            type="number"
            value={localInterval}
            onChange={(e) => setLocalInterval(e.target.value)}
            className="w-full border p-2 rounded"
            min={1}
          />
        </div>

        {/* 2) Descripción en Mayúsculas */}
        <div className="flex items-center mb-6">
          <label className="mr-4 font-medium">Mostrar en mayúsculas</label>
          <input
            type="checkbox"
            checked={localUppercase}
            onChange={(e) => setLocalUppercase(e.target.checked)}
            className="h-5 w-5"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600"
        >
          Guardar Configuración
        </button>
      </div>
    </div>
  );
}
