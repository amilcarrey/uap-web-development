import type { Tarea } from '../types/tarea'

type Props = {
  tarea: Tarea
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export default function TareaItem({ tarea, onToggle, onDelete }: Props) {
  return (
    <li className="tarea">
      <input
        type="checkbox"
        checked={tarea.completed}
        onChange={() => onToggle(tarea.id)}
      />
      <span className={tarea.completed ? 'line-through text-gray-500' : ''}>
        {tarea.content}
      </span>
      <button className="basura" onClick={() => onDelete(tarea.id)}>
        🗑️
      </button>
    </li>
  )
}
