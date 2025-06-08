import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type Board = { id: string, name: string }

export function BoardsList() {
  const [boards, setBoards] = useState<Board[]>([])
  const [newBoard, setNewBoard] = useState("")

  useEffect(() => {
    fetch("http://localhost:4321/api/get-boards")
      .then(res => res.json())
      .then(setBoards)
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBoard.trim()) return
    const formData = new FormData()
    formData.append("name", newBoard)
    await fetch("http://localhost:4321/api/add-board", { method: "POST", body: formData })
    setNewBoard("")
    fetch("http://localhost:4321/api/get-boards")
      .then(res => res.json())
      .then(setBoards)
  }

  const handleDelete = async (id: string) => {
    const formData = new FormData()
    formData.append("id", id)
    await fetch("http://localhost:4321/api/delete-board", { method: "POST", body: formData })
    setBoards(boards.filter(b => b.id !== id))
  }

  return (
    <div className="max-w-xl mx-auto mt-24 p-8 bg-purple-200 rounded-2xl shadow-lg">
      <h1 className="text-3xl mb-6 text-center">Tableros</h1>
      <div className="grid gap-4 mb-6">
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
    </div>
  )
}