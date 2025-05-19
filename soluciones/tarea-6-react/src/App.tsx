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
    <div className="app">
      <h1 className="text-5xl font-bold mb-6">
        <span className="text-green-800">To</span>
        <span className="text-green-400">Do</span>
      </h1>

      <FilterForm filtro={filtro} setFiltro={setFiltro} />

      <div className="my-6">
        <NuevoMensajeForm onAgregar={agregarTarea} />
      </div>

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
  )
}

export default App
