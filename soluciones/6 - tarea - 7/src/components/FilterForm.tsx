import React from 'react'

type Filtro = 'todas' | 'completadas' | 'incompletas'

type Props = {
  filtro: Filtro
  setFiltro: React.Dispatch<React.SetStateAction<Filtro>>
}

export default function FilterForm({ filtro, setFiltro }: Props) {
  return (
    <div className="flex justify-center gap-4 mb-4">
      <button
        className={`px-4 py-2 rounded ${
          filtro === 'todas' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'
        }`}
        onClick={() => setFiltro('todas')}
      >
        Todas
      </button>
      <button
        className={`px-4 py-2 rounded ${
          filtro === 'completadas' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'
        }`}
        onClick={() => setFiltro('completadas')}
      >
        Completadas
      </button>
      <button
        className={`px-4 py-2 rounded ${
          filtro === 'incompletas' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'
        }`}
        onClick={() => setFiltro('incompletas')}
      >
        Incompletas
      </button>
    </div>
  )
}
