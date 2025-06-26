import React, { useState } from "react";
import * as api from "../../api/api";

interface Props {
  boardId: number;
  onTaskCreated: () => void;
}

export const TaskForm = ({ boardId, onTaskCreated }: Props) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await api.createTask(boardId, content.trim());
      setContent("");
      onTaskCreated();
    } catch {
      setError("Error al crear tarea");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 10 }}>
      <input
        type="text"
        placeholder="Nueva tarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Agregar tarea</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};
