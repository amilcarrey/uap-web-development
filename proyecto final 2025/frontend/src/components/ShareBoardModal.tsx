import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  boardId: string;
  onClose: () => void;
};

const API_BASE = "http://localhost:3000";

export default function ShareBoardModal({ boardId, onClose }: Props) {
  const [users, setUsers] = useState<{ email: string; role: string }[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("viewer");

  useEffect(() => {
    fetch(`${API_BASE}/api/boards/${boardId}/users`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener usuarios");
        return res.json();
      })
      .then(setUsers)
      .catch((err) => toast.error(err.message));
  }, [boardId]);

  const handleShare = async () => {
    if (!newEmail) return toast.error("Ingresá un correo");

    try {
      const res = await fetch(`${API_BASE}/api/boards/${boardId}/share`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, role: newRole }),
      });

      if (!res.ok) throw new Error("No se pudo compartir el tablero");

      toast.success("Permisos actualizados correctamente");
      setNewEmail("");
      setNewRole("viewer");

      const updated = await fetch(`${API_BASE}/api/boards/${boardId}/users`, {
        credentials: "include",
      });

      const updatedUsers = await updated.json();
      setUsers(updatedUsers);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="text-red-500 hover:underline absolute top-2 right-2"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Compartir Tablero</h2>

        <div className="space-y-2 mb-4">
          {users.map((u, i) => (
            <div key={i} className="flex justify-between items-center border-b pb-1">
              <span>{u.email}</span>
              <span className="text-sm text-gray-600 capitalize">{u.role}</span>
            </div>
          ))}
        </div>

        <input
          type="email"
          placeholder="Correo del usuario"
          className="w-full p-2 border mb-2 rounded"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />

        <select
          className="w-full p-2 border mb-4 rounded"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>

        <button
          onClick={handleShare}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Compartir
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-300 text-black py-2 rounded mt-2 hover:bg-gray-400 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
