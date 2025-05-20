import type { Tarea } from '../types/tarea'
import ItemTarea from './TareaItem'

type Props = {
  tareas: Tarea[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export default function ListaTarea({ tareas, onToggle, onDelete }: Props) {
  return (
    <ul className="to-do">
      {tareas.map(tarea => (
        <ItemTarea
          key={tarea.id}
          tarea={tarea}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
