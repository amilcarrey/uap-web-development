import type { Tarea } from '../types'

type Props = {
  tarea: Tarea
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export default function MensajeItem({ tarea, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center justify-between p-3 mb-2 rounded-lg shadow-sm bg-white">
      {/* Contenedor izquierdo: ícono + texto */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggle(tarea.id)}
          className="text-2xl bg-none border-none cursor-pointer"
        >
          {tarea.completada ? '✅' : '⭕'}
        </button>

        <span className={`texto-tarea ${tarea.completada ? 'line-through text-gray-500' : ''}`}>
          {tarea.texto}
        </span>
      </div>

      <button
        onClick={() => onDelete(tarea.id)}
        className="text-2xl bg-none border-none cursor-pointer"
      >
        🗑️
      </button>
    </li>
  )
}
