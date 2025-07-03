import { useAuthStore } from "./store/useAuthStore";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";
import BoardSelector from "./components/BoardSelector";

export default function App() {
  const isAuth = useAuthStore((s) => s.isAuthenticated);

  return (
    <Router>
      <div className="min-h-screen bg-[#fffaf0] text-gray-800 font-sans">
        <nav className="bg-neutral-900 shadow p-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-white">📁 Gestiona las tareas ñaño</Link>
          <Link to="/configuracion" className="text-sm text-gray-300 hover:text-white transition">Configuración ⚙️</Link>
        </nav>

        <main className="p-4 max-w-4xl mx-auto">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {isAuth ? (
              <>
                <Route path="/" element={
                  <>
                    <BoardSelector />
                    <Home />
                  </>
                } />
                <Route path="/configuracion" element={<Settings />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}