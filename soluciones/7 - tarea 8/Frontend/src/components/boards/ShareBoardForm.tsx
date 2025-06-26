import React, { useState } from "react";
import * as api from "../../api/api";

interface Props {
  boardId: number;
}

export const ShareBoardForm = ({ boardId }: Props) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("read");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.shareBoard(boardId, email, permission);
      setMessage("Compartido exitosamente");
      setEmail("");
      setPermission("read");
    } catch {
      setMessage("Error compartiendo tablero");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>Compartir Tablero</h3>
      <input
        type="email"
        placeholder="Email del usuario"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <select
        value={permission}
        onChange={(e) => setPermission(e.target.value)}
        style={{ marginLeft: 10 }}
      >
        <option value="read">Solo lectura</option>
        <option value="edit">Editor</option>
        <option value="owner">Propietario</option>
      </select>
      <button type="submit" style={{ marginLeft: 10 }}>
        Compartir
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};
