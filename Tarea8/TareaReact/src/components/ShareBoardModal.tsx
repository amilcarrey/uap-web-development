import { useEffect, useState } from "react"

const BACKEND_URL = 'http://localhost:4321/api'

type Permission = {
  userId: number
  email: string
  name: string
  role: string
}

export function ShareBoardModal({
  boardId,
  open,
  onClose
}: {
  boardId: string | null
  open: boolean
  onClose: () => void
}) {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!boardId) return
    setLoading(true)
    fetch(`${BACKEND_URL}/boards/${boardId}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setPermissions(
          (data.permissions || []).map((p: any) => ({
            userId: p.userId,
            email: p.user?.email || "",
            name: p.user?.name || "",
            role: p.role
          }))
        )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [boardId, open])

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido")
      return
    }

    if (permissions.some(p => p.email === email)) {
      setError("Ese usuario ya tiene acceso")
      return
    }

    const res = await fetch(`${BACKEND_URL}/boards/${boardId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, role })
    })
    if (res.ok) {
      setEmail("")
      setRole("viewer")
      fetch(`${BACKEND_URL}/boards/${boardId}`, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          setPermissions(
            (data.permissions || []).map((p: any) => ({
              userId: p.userId,
              email: p.user?.email || "",
              name: p.user?.name || "",
              role: p.role
            }))
          )
        })
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.message || "Error al compartir tablero")
    }
  }

  const fetchPermissions = () => {
    fetch(`${BACKEND_URL}/boards/${boardId}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setPermissions(
          (data.permissions || []).map((p: any) => ({
            userId: p.userId,
            email: p.user?.email || "",
            name: p.user?.name || "",
            role: p.role
          }))
        )
      })
  }

  const handleChangeRole = async (userId: number, newRole: string) => {
    await fetch(`${BACKEND_URL}/boards/${boardId}/permissions/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role: newRole })
    })
    fetchPermissions()
  }

  const handleRemoveUser = async (userId: number) => {
    await fetch(`${BACKEND_URL}/boards/${boardId}/permissions/${userId}`, {
      method: "DELETE",
      credentials: "include"
    })
    fetchPermissions()
  }

  if (!open || !boardId) return null



  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-[350px]">
        <h2 className="text-xl font-bold mb-4">Compartir tablero</h2>
        {loading ? (
          <p>Cargando permisos...</p>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Usuarios con acceso:</h3>
              <ul>
                {permissions.map((p) => (
                  <li key={p.userId} className="mb-1 flex items-center gap-2">
                    <span className="font-bold">{p.name || p.email}</span>
                    {p.name ? (
                      <> ({p.email})</>
                    ) : null}
                    - <span className="italic">{p.role}</span>
                    {p.role !== 'owner' && (
                      <>
                        <select
                          value={p.role}
                          onChange={e => handleChangeRole(p.userId, e.target.value)}
                          className="border rounded px-1 py-0.5 ml-2"
                        >
                          <option value="editor">Editor</option>
                          <option value="viewer">Solo lectura</option>
                        </select>
                        <button
                          onClick={() => handleRemoveUser(p.userId)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Quitar usuario"
                        >
                          Quitar
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <form onSubmit={handleShare} className="flex flex-col gap-2 mb-4">
              <input
                type="email"
                placeholder="Email del usuario"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border rounded px-2 py-1"
                required
              />
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="editor">Editor</option>
                <option value="viewer">Solo lectura</option>
              </select>
              {error && <div className="text-red-500 text-center">{error}</div>}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Compartir
              </button>
            </form>
            <button
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full"
            >
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  )
}