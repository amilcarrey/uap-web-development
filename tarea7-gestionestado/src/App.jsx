import { Route, Routes, Navigate } from 'react-router-dom'
import BoardPage from "./features/boards/BoardPage"
import ConfigPage from './features/config/ConfigPage'
import BoardsList from './features/boards/BoardsList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<BoardsList />} />
      <Route path="/board/:id" element={<BoardPage />} />
      <Route path="/config" element={<ConfigPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
