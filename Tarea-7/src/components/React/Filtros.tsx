import React from 'react'
import { useUIStore } from '../../store/UIStore'

export default function Filtros() {
  const filtro = useUIStore((state) => state.filtro)
  const setFiltro = useUIStore((state) => state.setFiltro)

  return (
    <div>
      <button
        onClick={() => setFiltro('todas')}
        disabled={filtro === 'todas'}
      >
        Todas
      </button>
      <button
        onClick={() => setFiltro('completas')}
        disabled={filtro === 'completas'}
      >
        Completas
      </button>
      <button
        onClick={() => setFiltro('incompletas')}
        disabled={filtro === 'incompletas'}
      >
        Incompletas
      </button>
    </div>
  )
}
