// src/pages/Home.tsx
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Trash2, LogOut, Settings } from "lucide-react";
import { useBoards } from "../hooks/useBoard";
import { BoardSettings } from "../components/BoardSettings";
import { useDeleteBoard } from "../hooks/useDeleteBoard";
import { useBoardStore } from "../store/boardStore";
import { useAuth } from "../hooks/useAuth";

const FILTERS = [
  { key: "all", label: "Todos" },
  { key: "owned", label: "Míos" },
  { key: "shared", label: "Compartidos" },
];

export default function Home() {
  const { data: boards = [], isLoading, isError } = useBoards();
  const { mutate: deleteBoard } = useDeleteBoard();
  const [boardToDelete, setBoardToDelete] = useState<any>(null);

  const { filter, setFilter } = useBoardStore();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const filteredBoards = user
    ? boards.filter((board: any) => {
        if (filter === "owned") return board.owner_id === user.id;
        if (filter === "shared") return board.owner_id !== user.id;
        return true;
      })
    : [];

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col relative">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-pink-100 shadow-sm">
        <h1 className="text-xl font-bold text-pink-700">Mis Tableros</h1>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-pink-700 font-medium">
            {user?.name}
          </span>
          
          {/* Ícono de configuración (ruedita) */}
          <Link 
            to="/boards/configuracion"
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-pink-200 hover:bg-pink-300 text-pink-700 transition"
            title="Configuraciones"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        <BoardSettings />

        {isLoading ? (
          <p className="text-pink-600 text-center">Cargando tableros...</p>
        ) : isError ? (
          <p className="text-red-600 text-center">Error al cargar tableros</p>
        ) : filteredBoards.length === 0 ? (
          <p className="text-center text-pink-700">
            {filter === "all"
              ? "No hay tableros disponibles"
              : filter === "owned"
              ? "No tienes tableros propios"
              : "No tienes tableros compartidos"}
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBoards.map((board: any) => (
              <div
                key={board.id}
                className="relative bg-white rounded-2xl shadow hover:shadow-lg transition p-6 text-center text-pink-800 font-semibold border border-pink-200 hover:bg-pink-50"
              >
                <Link
                  to="/reminder/$boardId"
                  params={{ boardId: board.id }}
                  className="block"
                >
                  {board.name}
                  {user && board.owner_id !== user.id && (
                    <span className="block text-xs text-pink-500 mt-1">
                      Compartido
                    </span>
                  )}
                </Link>

                {user && board.owner_id === user.id && (
                  <button
                    onClick={() => setBoardToDelete(board)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full p-1 transition"
                    title="Eliminar tablero"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal de confirmación */}
        {boardToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-[340px] max-w-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                ¿Eliminar tablero?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                ¿Estás seguro de que querés eliminar el tablero{" "}
                <span className="font-bold text-rose-600">{boardToDelete.name}</span>? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setBoardToDelete(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    deleteBoard(boardToDelete.id);
                    setBoardToDelete(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Botón de logout flotante - abajo a la derecha */}
      <button
        onClick={handleLogout}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        title="Cerrar sesión"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">Salir</span>
      </button>

      {/* Filtros */}
      <footer className="p-4 flex justify-center gap-4 bg-pink-100 border-t border-pink-200">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as "all" | "owned" | "shared")}
            className={
              "px-4 py-2 rounded-xl font-medium transition " +
              (filter === f.key
                ? "bg-pink-400 text-white"
                : "bg-pink-300 hover:bg-pink-400 text-white")
            }
          >
            {f.label}
          </button>
        ))}
      </footer>
    </div>
  );
}