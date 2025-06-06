import React from "react"
import type { Tarea } from "../../types/tarea"
import { useTareasStore } from "../../store/TareasStore"
import { useSettingsStore } from "../../store/Configuraciones"

interface Props {
  tarea: Tarea
  onUpdate: (tarea: Tarea) => void
  onDelete: (id: number) => void
}

export const TareaItem = ({ tarea, onUpdate, onDelete }: Props) => {
  const { startEditing } = useTareasStore()
  const { uppercase } = useSettingsStore()
  
  return (
    <li>
      <span>
        {uppercase ? tarea.content.toUpperCase() : tarea.content}
      </span>
      <button onClick={() => startEditing(tarea.id, tarea.content)}>Editar</button>
      <button onClick={() => onDelete(tarea.id)}>Eliminar</button>
    </li>
  )
}
