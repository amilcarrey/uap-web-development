import React from "react";
import { useSettingsStore } from "../store/Configuraciones";

const Configuraciones = () => {
  const { refetchInterval, setRefetchInterval, uppercase, toggleUppercase } = useSettingsStore();

  return (
    <div className="container">
      <div>
        <h2 id="subencabezado">Configuraciones</h2>
        <div className="filtros">
          <label>
            Refetch (ms):
            <input
              type="number"
              value={refetchInterval}
              onChange={(e) => setRefetchInterval(Number(e.target.value))}
              min={1000}
            />
          </label>
          <label>
            <input type="checkbox" checked={uppercase} onChange={toggleUppercase} />
            Tareas en mayúsculas
          </label>
        </div>
      </div>
    </div>
  );
};

export default Configuraciones;
