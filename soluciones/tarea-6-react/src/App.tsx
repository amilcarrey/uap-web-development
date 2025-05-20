import { useEffect, useState } from 'react'
import type { Tarea } from './types'
import MensajeList from './components/MensajeList'
import NuevoMensajeForm from './components/NuevoMensajeForm'
import FilterForm from './components/FilterForm'
import './App.css'

type Filtro = 'todas' | 'completadas' | 'incompletas'

function App() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [filtro, setFiltro] = useState<Filtro>('todas')

  useEffect(() => {
    const tareasGuardadas = localStorage.getItem('tareas')
    if (tareasGuardadas) {
      setTareas(JSON.parse(tareasGuardadas))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas))
  }, [tareas])

  const agregarTarea = (texto: string) => {
    if (!texto.trim()) return
    const nueva: Tarea = {
      id: Date.now(),
      texto,
      completada: false,
    }
    setTareas([...tareas, nueva])
  }

  const alternarCompletada = (id: number) => {
    setTareas(tareas.map(t => t.id === id ? { ...t, completada: !t.completada } : t))
  }

  const eliminarTarea = (id: number) => {
    setTareas(tareas.filter(t => t.id !== id))
  }

  const eliminarCompletadas = () => {
    setTareas(tareas.filter(t => !t.completada))
  }

  const tareasFiltradas = tareas.filter(t => {
    if (filtro === 'completadas') return t.completada
    if (filtro === 'incompletas') return !t.completada
    return true
  })

  return (
    <>
  <div className="w-screen bg-green-300 py-4 mb-6 fixed top-0 left-0 z-50">
    <h1 className="text-5xl font-bold text-green-900">
      <span className="text-green-700">To</span>
      <span className="text-green-500">Do</span>
    </h1>
  </div>

  <div className="pt-20">
    {/* El resto del contenido abajo, con padding-top para que no quede oculto debajo de la barra fija */}
    <FilterForm filtro={filtro} setFiltro={setFiltro} />

    <div className="my-6">
      <NuevoMensajeForm onAgregar={agregarTarea} />
    </div>

    <div className="app">
      <MensajeList
        tareas={tareasFiltradas}
        onToggle={alternarCompletada}
        onDelete={eliminarTarea}
      />

      <div className="flex justify-end mt-4">
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={eliminarCompletadas}
        >
          Eliminar completadas
        </button>
      </div>
    </div>
  </div>
</>

  )
}

export default App
