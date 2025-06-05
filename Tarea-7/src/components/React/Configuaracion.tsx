import React from 'react'
import { useUIStore } from '../../store/UIStore'
import { Link } from 'react-router-dom'

export default function Configuraciones() {
  const descripcionMayusculas = useUIStore((state) => state.descripcionMayusculas)
  const setDescripcionMayusculas = useUIStore((state) => state.setDescripcionMayusculas)

  return (
    <div>
      <h2>Configuraciones</h2>
      <label>
        <input
          type="checkbox"
          checked={descripcionMayusculas}
          onChange={(e) => setDescripcionMayusculas(e.target.checked)}
        />
        Mostrar tareas en mayúsculas
      </label>

      <Link to="/tablero/default">Volver al tablero</Link>
    </div>
  )
}
