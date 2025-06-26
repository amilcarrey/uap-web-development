// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BoardPage from './pages/BoardPage'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/board/:boardId" element={<BoardPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<p>404 - No encontrado</p>} />
      </Routes>
    </BrowserRouter>
  )
}