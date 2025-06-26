import React, { useState } from "react";
import * as api from "../../api/api";

interface Props {
  onBoardCreated: () => void; // Callback para avisar al padre que se creó un tablero nuevo
}

export const BoardForm = ({ onBoardCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    try {
      await api.createBoard(title.trim());
      setTitle("");
      setError(null);
      onBoardCreated(); // Recargar listado de tableros en el padre
    } catch {
      setError("Error creando tablero");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nuevo tablero"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Crear</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};
