import type { Tarea } from '../../types/tarea'

type Props = {
  tarea: Tarea
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export default function TareaItem({ tarea, onToggle, onDelete }: Props) {
  return (
    <li className={tarea.completed ? 'completada' : ''}>
      <input
        type="checkbox"
        checked={tarea.completed}
        onChange={() => onToggle(tarea.id)}
      />
      <span>{tarea.content}</span>
      <button onClick={() => onDelete(tarea.id)}>Eliminar</button>
    </li>
  )
}