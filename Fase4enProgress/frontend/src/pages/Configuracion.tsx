// src/pages/Configuracion.tsx
import React from "react";
import { useConfiguracionStore } from "../store/configuracionStore";

const ConfiguracionPage = () => {
  const refreshInterval = useConfiguracionStore((s) => s.refreshInterval);
  const capitalizeTasks = useConfiguracionStore((s) => s.capitalizeTasks);
  const setRefreshInterval = useConfiguracionStore((s) => s.setRefreshInterval);
  const setCapitalizeTasks = useConfiguracionStore((s) => s.setCapitalizeTasks);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Configuraciones</h1>

      <div className="mb-6">
        <label className="block font-semibold mb-1">
          Intervalo de Refetch (segundos)
        </label>
        <input
          type="number"
          min={1}
          value={refreshInterval / 1000}
          onChange={(e) => setRefreshInterval(Number(e.target.value) * 1000)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="flex items-center">
        <input
          id="mayusculas"
          type="checkbox"
          checked={capitalizeTasks}
          onChange={() => setCapitalizeTasks(!capitalizeTasks)}
          className="mr-2"
        />
        <label htmlFor="mayusculas">Mostrar descripciones en mayúsculas</label>
      </div>
    </div>
  );
};

export default ConfiguracionPage;
