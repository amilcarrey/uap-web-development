import { Link, useNavigate } from 'react-router-dom'
import { useBoards, useAddBoard, useDeleteBoard } from '../../api/useBoards'
import { useState } from 'react'

function BoardsList() {
  const { data: boards, isLoading } = useBoards()
  const { mutate: addBoard } = useAddBoard()
  const { mutate: deleteBoard } = useDeleteBoard()
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    addBoard({ name }, {
      onSuccess: (data) => {
        setName('')
        navigate(`/board/${data.id}`)
      }
    })
  }

  if (isLoading) return <p>Cargando tableros...</p>

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Tableros</h2>

      <ul className="mb-4 space-y-2">
        {boards.map((board) => (
          <li key={board.id} className="flex justify-between items-center bg-white p-2 rounded shadow">
            <Link to={`/board/${board.id}`} className="text-blue-600 hover:underline">
              {board.name}
            </Link>
            <button
              onClick={() => deleteBoard(board.id)}
              className="text-red-500"
              title="Eliminar tablero"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Nuevo tablero..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Crear
        </button>
      </form>
    </div>
  )
}

export default BoardsList
