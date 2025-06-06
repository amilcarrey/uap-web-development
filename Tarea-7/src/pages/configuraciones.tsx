import React from "react"
import { useSettingsStore } from "../store/Configuraciones"

const Configuraciones = () => {
  const { refetchInterval, setRefetchInterval, uppercase, toggleUppercase } = useSettingsStore()

  return (
    <div>
      <h2>Configuraciones</h2>
      <label>
        Intervalo de refetch (ms):
        <input
          type="number"
          value={refetchInterval}
          onChange={(e) => setRefetchInterval(Number(e.target.value))}
          min={1000}
        />
      </label>
      <label>
        <input type="checkbox" checked={uppercase} onChange={toggleUppercase} />
        Mostrar tareas en mayúsculas
      </label>
    </div>
  )
}

export default Configuraciones
