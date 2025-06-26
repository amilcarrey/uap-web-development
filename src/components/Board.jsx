import { useTasks } from '../hooks/useTasks'
import { useUIStore } from '../store/useUIStore'

export default function Board({ boardId }) {
    const [page, setPage] = useState(1)
  const { data: tasks, isLoading, isError } = useTasks(boardId, page, 5)
  const uppercase = useUIStore(state => state.config.uppercase)

  if (isLoading) return <p>Cargando...</p>
  if (isError) return <p>Error cargando tareas 😢</p>

  return (
    <ul>
      {tasks.map((t) => (
        <li key={t.id}>{uppercase ? t.text.toUpperCase() : t.text}</li>
      ))}
    </ul>
  )
}
<div className="flex gap-2 justify-center mt-4">
  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
    ⬅️ Anterior
  </button>
  <span>Página {page}</span>
  <button onClick={() => setPage((p) => p + 1)}>
    Siguiente ➡️
  </button>
</div>
