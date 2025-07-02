// src/components/ShareBoard.tsx
import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { toast } from "react-toastify";

export default function ShareBoard() {
  const board = useAppStore((s) => s.selectedBoard);
  const [username, setUsername] = useState("");
  const [level, setLevel] = useState("viewer");

  const handleShare = async () => {
    const res = await fetch("/api/boards/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ boardName: board, username, level }),
    });

    if (!res.ok) {
      toast.error("Error al compartir tablero");
    } else {
      toast.success(`Acceso otorgado a ${username}`);
      setUsername("");
    }
  };

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h3 className="font-semibold text-lg mb-2">Compartir tablero</h3>
      <div className="flex gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nombre de usuario"
          className="border px-2 py-1 rounded"
        />
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="border px-2 py-1 rounded">
          <option value="viewer">Lector</option>
          <option value="editor">Editor</option>
          <option value="owner">Dueño</option>
        </select>
        <button onClick={handleShare} className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition">Compartir</button>
      </div>
    </div>
  );
}