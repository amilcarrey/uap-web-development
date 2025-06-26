import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";  // <-- agrego Link
import * as api from "../../api/api";
import { TaskForm } from "../tasks/TaskForm";
import { TasksList } from "../tasks/TasksList";
import { ShareBoardForm } from "./ShareBoardForm";

interface Board {
  id: number;
  title: string;
}

export const BoardDetail = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadTasks, setReloadTasks] = useState(false);

  const fetchBoard = async () => {
    try {
      if (!boardId) return;
      const data = await api.getBoardById(Number(boardId));
      setBoard(data);
    } catch {
      setError("Error cargando tablero");
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  if (!board) return <p>{error || "Cargando..."}</p>;

  return (
    <div>
      <Link to="/boards" style={{ display: "inline-block", marginBottom: "10px" }}>
        ← Volver a mis tableros
      </Link>

      <h2>{board.title}</h2>

      <ShareBoardForm boardId={board.id} />

      <TaskForm boardId={board.id} onTaskCreated={() => setReloadTasks(!reloadTasks)} />

      <TasksList boardId={board.id} reload={reloadTasks} />
    </div>
  );
};
