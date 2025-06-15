import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TablerosNav } from "./components/TablerosNav";
import { TableroPage } from "./pages/TableroPage";
import { ConfigPage } from "./pages/ConfigPage";
import Toasts from "./components/Toasts";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <header>
          <h1 className="todo-title">
            To<span className="green">Do</span>
          </h1>
          <nav>
            <Link to="/">Inicio</Link>
            <Link to="/config">Configuración</Link>
          </nav>
        </header>
        <main>
          {/* Panel lateral de tableros */}
          <aside>
            <TablerosNav />
          </aside>
          {/* Sección principal: cada página (tablero o config) */}
          <section className="todo-wrapper">
            <Routes>
              <Route path="/" element={<Navigate to="/tablero/1" />} />
              <Route path="/tablero/:id" element={<TableroPage />} />
              <Route path="/config" element={<ConfigPage />} />
            </Routes>
          </section>
        </main>
        <Toasts />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
