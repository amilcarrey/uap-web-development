// src/hooks/useBoardData.ts
import { useEffect, useState } from "react";
import { useMatch } from "@tanstack/react-router"; // <- para leer el boardId de la URL

interface Board {
  id: string;
  name: string;
}

export function useBoard() {
  // Lee boardId solo si estás en una ruta tipo /boards/$boardId
  let boardId: string | undefined;
  try {
    const match = useMatch({ from: "/boards/$boardId" });
    boardId = match?.params.boardId;
  } catch {
    boardId = undefined; // No está en una ruta con $boardId
  }

  const [boards, setBoards] = useState<Board[] | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const url = boardId
      ? `http://localhost:4321/api/boards/${boardId}`
      : `http://localhost:4321/api/boards`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar tableros");
        return res.json();
      })
      .then((data) => {
        if (boardId) {
          setBoard(data);
          setBoards(null);
        } else {
          setBoards(data);
          setBoard(null);
        }
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setBoards(null);
        setBoard(null);
      })
      .finally(() => setLoading(false));
  }, [boardId]);

  return { board, boards, loading, error };
}
