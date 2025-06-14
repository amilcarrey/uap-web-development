import React from "react"
import { useRouter } from "next/router"
import { ListaTareas } from "../../components/React/ListaTarea"
import { ToastContainer } from "../../components/React/ContenedorNotificaciones"

const TableroPage = () => {
  const router = useRouter()
  const { tableroId } = router.query
  if (!tableroId || typeof tableroId !== "string") return <div>Cargando...</div>

  return (
    <div>
      <h1>Tablero {tableroId}</h1>
      <ListaTareas tableroId={tableroId} />
      <ToastContainer />
    </div>
  )
}

export default TableroPage
