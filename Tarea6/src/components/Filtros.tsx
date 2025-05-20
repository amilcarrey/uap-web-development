import React from 'react'

type Filtro = 'todas' | 'completas' | 'incompletas'

type Props = {
  filtro: Filtro
  setFiltro: React.Dispatch<React.SetStateAction<Filtro>>
}

export default function FilterForm({ filtro, setFiltro }: Props) {
  return (
    <div className="filtros">
      <button
        className={filtro === 'todas' ? 'active' : ''}
        onClick={() => setFiltro('todas')}
        type="button"
      >
        Todas
      </button>
      <button
        className={filtro === 'completas' ? 'active' : ''}
        onClick={() => setFiltro('completas')}
        type="button"
      >
        Completas
      </button>
      <button
        className={filtro === 'incompletas' ? 'active' : ''}
        onClick={() => setFiltro('incompletas')}
        type="button"
      >
        Incompletas
      </button>
    </div>
  )
}
