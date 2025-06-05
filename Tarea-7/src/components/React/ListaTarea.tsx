import React, { useState } from 'react'
import type { Tarea } from '../../types/tarea'

interface Props {
  tareas: Tarea[]
  onEditar: (id: number) => void
  onEliminar: (id: number) => void
  editandoTareaId: number | null
  onCancelarEdicion: () => void
  onGuardar: (tarea: { id: number; content: string; completed: boolean }) => void
}

export default function ListaTarea({
  tareas,
  onEditar,
  onEliminar,
  editandoTareaId,
  onCancelarEdicion,
  onGuardar,
}: Props) {
  const [contenidoEdit, setContenidoEdit] = useState('')

  React.useEffect(() => {
    if (editandoTareaId !== null) {
      const tarea = tareas.find((t) => t.id === editandoTareaId)
      setContenidoEdit(tarea ? tarea.content : '')
    }
  }, [editandoTareaId, tareas])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editandoTareaId !== null) {
      onGuardar({
        id: editandoTareaId,
        content: contenidoEdit,
        completed: tareas.find((t) => t.id === editandoTareaId)?.completed ?? false,
      })
    }
  }

  return (
    <ul>
      {tareas.map((t) =>
        editandoTareaId === t.id ? (
          <li key={t.id}>
            <form onSubmit={onSubmit}>
              <input
                value={contenidoEdit}
                onChange={(e) => setContenidoEdit(e.target.value)}
                autoFocus
              />
              <button type="submit">Guardar</button>
              <button type="button" onClick={onCancelarEdicion}>
                Cancelar
              </button>
            </form>
          </li>
        ) : (
          <li key={t.id}>
            <span
              style={{ textDecoration: t.completed ? 'line-through' : 'none' }}
            >
              {t.content}
            </span>
            <button onClick={() => onEditar(t.id)}>Editar</button>
            <button onClick={() => onEliminar(t.id)}>Eliminar</button>
          </li>
        )
      )}
    </ul>
  )
}
