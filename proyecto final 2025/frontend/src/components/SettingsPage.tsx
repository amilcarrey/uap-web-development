import React from "react";
import { useSettings } from "../context/settings-context";

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, toggleSettingsPage } = useSettings();

  return (
    <div className="p-6 bg-white rounded-md shadow-md mt-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Configuraciones</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Intervalo de Refetch (segundos):</label>
        <input
          type="number"
          min={1}
          value={settings.refetchInterval / 1000}
          onChange={(e) => updateSettings({ refetchInterval: Number(e.target.value) * 1000 })}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.uppercaseDescriptions}
            onChange={() => updateSettings({ uppercaseDescriptions: !settings.uppercaseDescriptions })}
          />
          <span>Descripción en Mayúsculas</span>
        </label>
      </div>

      <button
        onClick={toggleSettingsPage}
        className="mt-4 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
      >
        Volver
      </button>
    </div>
  );
};

export default SettingsPage;
