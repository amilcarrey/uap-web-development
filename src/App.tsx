import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import BoardSelector from "./components/BoardSelector";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#fffaf0] text-gray-800 font-sans">
        <nav className="bg-neutral-900 shadow p-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-white">📁 Gestiona las tareas ñaño</Link>
          <Link to="/configuracion" className="text-sm text-gray-300 hover:text-white transition">Configuración ⚙️</Link>
        </nav>

        <main className="p-4 max-w-4xl mx-auto">
          <BoardSelector />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/configuracion" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}