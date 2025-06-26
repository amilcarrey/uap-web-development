import { useParams } from 'react-router-dom'
import Board from '../components/Board'
import TaskForm from '../components/TaskForm'
import { useTasks } from '../hooks/useTasks'


export default function BoardPage() {
  const { boardId } = useParams()

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold text-orange-500 mb-2">Tablero: {boardId}</h2>
      <TaskForm boardId={boardId} />
      <Board boardId={boardId} />
    </div>
  )
}
