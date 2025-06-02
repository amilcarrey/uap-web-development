import { createFileRoute } from '@tanstack/react-router'
import TodoList from '../components/react/TodoList'
import { useQuery } from '@tanstack/react-query'
import { getBoard } from '../services/boardService'

export const Route = createFileRoute('/boards/$boardId')({
  component: BoardPage,
})

function BoardPage() {
  const { boardId } = Route.useParams()
  const { data: board, isLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => getBoard(boardId),
  })

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{board?.name}</h1>
      <TodoList boardId={boardId} />
    </div>
  )
} 