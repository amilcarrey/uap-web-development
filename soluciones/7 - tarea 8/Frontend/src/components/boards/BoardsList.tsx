import React, { useEffect, useState } from "react";
import * as api from "../../api/api";
import { Link } from "react-router-dom";

interface Board {
  id: number;
  title: string;
  permission: string;
}

export const BoardsList = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const fetchBoards = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBoards();
      setBoards(data);
    } catch {
      setError("Error al cargar los tableros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.createBoard(newTitle.trim());
      setNewTitle("");
      fetchBoards();
    } catch {
      setError("Error al crear el tablero");
    }
  };

  const handleDeleteBoard = async (boardId: number) => {
    if (!window.confirm("¿Seguro que querés eliminar este tablero?")) return;
    try {
      await api.deleteBoard(boardId);
      fetchBoards();
    } catch {
      setError("Error al eliminar el tablero");
    }
  };

  return (
    <div>
      <h2>Mis Tableros</h2>

      <form onSubmit={handleCreateBoard}>
        <input
          type="text"
          placeholder="Nuevo título de tablero"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <button type="submit">Crear Tablero</button>
      </form>

      {loading && <p>Cargando tableros...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {boards.map((board) => (
          <li key={board.id} style={{ marginBottom: 8 }}>
            <Link to={`/boards/${board.id}`}>
              <strong>{board.title}</strong>
            </Link>{" "}
            — Permiso: {board.permission}
            {board.permission === "owner" && (
              <button
                onClick={() => handleDeleteBoard(board.id)}
                style={{ marginLeft: 12, color: "red" }}
              >
                Eliminar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
