//src/pages/Configuracion.tsx

import React from "react";
import { useConfiguracionStore } from "../store/configuracionStore";

const ConfiguracionPage = () => {
  const intervaloRefetch = useConfiguracionStore((s) => s.intervaloRefetch);
  const descripcionMayusculas = useConfiguracionStore((s) => s.descripcionMayusculas);
  const setIntervaloRefetch = useConfiguracionStore((s) => s.setIntervaloRefetch);
  const setDescripcionMayusculas = useConfiguracionStore((s) => s.setDescripcionMayusculas);

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
          value={intervaloRefetch / 1000}
          onChange={(e) => setIntervaloRefetch(Number(e.target.value) * 1000)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="flex items-center">
        <input
          id="mayusculas"
          type="checkbox"
          checked={descripcionMayusculas}
          onChange={() => setDescripcionMayusculas(!descripcionMayusculas)}
          className="mr-2"
        />
        <label htmlFor="mayusculas">Mostrar descripciones en mayúsculas</label>
      </div>
    </div>
  );
};

export default ConfiguracionPage;
