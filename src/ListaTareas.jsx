import React, { useEffect, useState } from 'react'

function ListaTareas() {
  const [tareas, setTareas] = useState([])
  const [nuevaTarea, setNuevaTarea] = useState('')
  const [filtro, setFiltro] = useState('todas')

  // Cargar tareas del backend al iniciar
  useEffect(() => {
    fetch('/tareas')
      .then(res => res.json())
      .then(data => setTareas(data))
  }, [])

  // Agregar nueva tarea
  const agregarTarea = (e) => {
    e.preventDefault()
    if (nuevaTarea.trim() === '') return

    fetch('/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: nuevaTarea })
    })
      .then(res => res.json())
      .then(nueva => {
        setTareas([...tareas, nueva])
        setNuevaTarea('')
      })
  }

  // Alternar completada
  const alternarCompleta = (id) => {
    fetch(`/tareas/${id}/completar`, { method: 'PATCH' })
      .then(() => {
        setTareas(tareas.map(t =>
          t.id === id ? { ...t, completada: !t.completada } : t
        ))
      })
  }

  // Eliminar tarea
  const eliminarTarea = (id) => {
    fetch(`/tareas/${id}`, { method: 'DELETE' })
      .then(() => {
        setTareas(tareas.filter(t => t.id !== id))
      })
  }

  // Eliminar completadas
  const borrarCompletadas = () => {
    const completadas = tareas.filter(t => t.completada)
    completadas.forEach(t => eliminarTarea(t.id))
  }

  // Filtro
  const tareasFiltradas = tareas.filter(t => {
    if (filtro === 'completadas') return t.completada
    if (filtro === 'pendientes') return !t.completada
    return true
  })

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={agregarTarea} className="mb-4 flex gap-2">
        <input
          type="text"
          className="border rounded px-2 py-1 flex-1"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Escribí una tarea..."
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded">
          Agregar
        </button>
      </form>

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setFiltro('todas')} className={filtro === 'todas' ? 'font-bold' : ''}>Todas</button>
        <button onClick={() => setFiltro('pendientes')} className={filtro === 'pendientes' ? 'font-bold' : ''}>Pendientes</button>
        <button onClick={() => setFiltro('completadas')} className={filtro === 'completadas' ? 'font-bold' : ''}>Completadas</button>
      </div>

      <ul className="space-y-2">
        {tareasFiltradas.map((t) => (
          <li key={t.id} className="bg-white rounded shadow p-2 flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.completada}
                onChange={() => alternarCompleta(t.id)}
              />
              <span className={t.completada ? 'line-through text-gray-400' : ''}>
                {t.titulo}
              </span>
            </label>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => eliminarTarea(t.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {/* Acciones */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <p>{tareas.filter(t => !t.completada).length} tareas pendientes</p>
        <button onClick={borrarCompletadas} className="text-blue-500 hover:underline">
          Clear Completed
        </button>
      </div>
    </div>
  )
}

export default ListaTareas
