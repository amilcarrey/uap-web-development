import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { LogoutButton } from "./Logout"
import { ShareBoardModal } from "./ShareBoardModal"

const BACKEND_URL = 'http://localhost:4321/api'

type Board = { id: string, name: string }

export function BoardsList() {
  const [boards, setBoards] = useState<Board[]>([])
  const [newBoard, setNewBoard] = useState("")
  const [shareBoardId, setShareBoardId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchBoards = () => {
    fetch(`${BACKEND_URL}/boards`, {
      credentials: 'include'
    })
      .then(res => {
        if (res.status === 401) {
          window.location.href = '/login'
          return { boards: [] }
        }
        return res.json()
      })
      .then(data => setBoards(data ?? []))
      .catch(() => setBoards([]))
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBoard.trim()) return
    await fetch(`${BACKEND_URL}/boards`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ name: newBoard })
    })
    setNewBoard("")
    fetchBoards()
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`${BACKEND_URL}/boards/${id}`, {
      method: "DELETE",
      credentials: 'include'
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.message || "Error al eliminar el tablero")
      return
    }
    fetchBoards()
  }


  return (
    <div className="max-w-xl mx-auto mt-24 p-8 bg-purple-200 rounded-2xl shadow-lg">
      {
        error && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
              <p className="mb-4 text-center text-red-700">{error}</p>
              <button
                className="block mx-auto px-4 py-2 bg-purple-600 text-white rounded"
                onClick={() => setError(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )
      }
      <h1 className="text-3xl mb-6 text-center">Tableros</h1>
      <div className="grid gap-4 mb-6">
        <LogoutButton />
        {boards.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <Link
              to={`/board/${b.id}`}
              className="flex-1 text-black font-semibold text-xl transition-colors duration-200 hover:text-red-700 cursor-pointer"
            >
              {b.name}
            </Link>
            <button
              onClick={() => handleDelete(b.id)}
              className="ml-4 text-xl text-red-500 hover:text-red-700"
              title="Eliminar tablero"
            >
              🗑
            </button>
            <button
              onClick={() => setShareBoardId(b.id)}
              className="ml-2 text-xl text-blue-500 hover:text-blue-700"
              title="Compartir tablero"
            >
              🤝
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          value={newBoard}
          onChange={e => setNewBoard(e.target.value)}
          placeholder="Nuevo tablero"
          className="flex-1 border rounded px-2 py-1"
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded">Crear</button>
      </form>
      <ShareBoardModal
        boardId={shareBoardId}
        open={!!shareBoardId}
        onClose={() => setShareBoardId(null)}
      />
    </div>
  )
}