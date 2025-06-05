import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import App from './App'
import Configuraciones from './components/React/Configuaracion'

function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tablero/default" replace />} />
        <Route path="/tablero/:tableroId" element={<TableroPage />} />
        <Route path="/config" element={<Configuraciones />} />
      </Routes>
    </BrowserRouter>
  )
}

function TableroPage() {
  const { tableroId } = useParams<{ tableroId: string }>()
  if (!tableroId) return <p>Tablero no encontrado</p>
  return <App tableroId={tableroId} />
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<Root />)
