import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogoutModal } from "./LogoutModal"

const BACKEND_URL = 'http://localhost:4321/api'

export function LogoutButton() {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include"
    })
    setShowModal(false)
    navigate("/login")
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed top-4 left-4 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 z-50"
      >
        Cerrar sesión
      </button>
      <LogoutModal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleLogout}
      />
    </>
  )
}