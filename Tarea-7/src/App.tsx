import { useState } from 'react'
import FormularioTarea from './components/React/TareaFormulario'
import Filtros from './components/React/Filtros'
import ListaTarea from './components/React/ListaTarea'
import Notificaciones from './components/React/Notificaciones'

import {
  useObtenerTareas,
  useActualizarTarea,
  useEliminarTarea,
  useAgregarTarea,
} from './hooks/useTareas'
import { useUIStore } from './store/UIStore'
import { usePaginationStore } from './store/Paginacion'
import './App.css'

interface AppProps {
  tableroId: string
}

function App({ tableroId }: AppProps) {
  const [editandoTareaId, setEditandoTareaId] = useState<number | null>(null)

  const pagina = usePaginationStore((state) => state.pagina)
  const porPagina = usePaginationStore((state) => state.porPagina)
  const setPagina = usePaginationStore((state) => state.setPagina)

  const filtro = useUIStore((state) => state.filtro)
  const descripcionMayusculas = useUIStore((state) => state.descripcionMayusculas)

  const { data, isLoading, isError } = useObtenerTareas(tableroId, pagina, porPagina)
  const tareas = data?.tareas ?? []
  const total = data?.total ?? 0

  const actualizar = useActualizarTarea(tableroId)
  const eliminar = useEliminarTarea(tableroId)
  const agregar = useAgregarTarea(tableroId)

  const tareasFiltradas = tareas.filter((t) => {
    if (filtro === 'completas') return t.completed
    if (filtro === 'incompletas') return !t.completed
    return true
  })

  // Aplica mayúsculas a descripción si está activado en config
  const tareasDisplay = descripcionMayusculas
    ? tareasFiltradas.map((t) => ({ ...t, content: t.content.toUpperCase() }))
    : tareasFiltradas

  function onEditar(tareaId: number) {
    setEditandoTareaId(tareaId)
  }

  function onCancelarEdicion() {
    setEditandoTareaId(null)
  }

  function onGuardar(tarea: { id: number; content: string; completed: boolean }) {
    actualizar.mutate(
      { ...tarea, tableroId },
      {
        onSuccess: () => setEditandoTareaId(null),
      }
    )
  }

  function onEliminar(id: number) {
    eliminar.mutate(id)
  }

  function onAgregar(content: string) {
    agregar.mutate({ content, completed: false, tableroId })
  }

  // Paginación
  const totalPaginas = Math.ceil(total / porPagina)

  return (
    <div className="app">
      <h1>Tablero: {tableroId}</h1>

      <FormularioTarea onAgregar={onAgregar} />

      <Filtros />

      {isLoading && <p>Cargando tareas...</p>}
      {isError && <p>Error al cargar tareas</p>}

      <ListaTarea
        tareas={tareasDisplay}
        onEditar={onEditar}
        onEliminar={onEliminar}
        editandoTareaId={editandoTareaId}
        onCancelarEdicion={onCancelarEdicion}
        onGuardar={onGuardar}
      />

      <div className="paginacion">
        <button
          disabled={pagina <= 1}
          onClick={() => setPagina(pagina - 1)}
        >
          Anterior
        </button>

        <span>
          Página {pagina} de {totalPaginas}
        </span>

        <button
          disabled={pagina >= totalPaginas}
          onClick={() => setPagina(pagina + 1)}
        >
          Siguiente
        </button>
      </div>

      <Notificaciones />
    </div>
  )
}

export default App
