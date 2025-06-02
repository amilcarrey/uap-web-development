import type { Tarea } from '../types'
import MensajeItem from './MensajeItem'

type Props = {
  tareas: Tarea[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export default function MensajeList({ tareas, onToggle, onDelete }: Props) {
  return (
    <ul>
      {tareas.map(t => (
        <MensajeItem
          key={t.id}
          tarea={t}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
