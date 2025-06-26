// components/InviteUserDialog.tsx
import { useInviteUser } from "../hooks/useInviteUser";
import { useState } from "react";

export function InviteUserDialog({ boardId, users, onClose }: any) {
  const inviteUser = useInviteUser(boardId);
  const [selectedUser, setSelectedUser] = useState("");
  const [accessLevel, setAccessLevel] = useState("viewer");

  const handleInvite = () => {
    if (selectedUser && accessLevel) {
      inviteUser.mutate({ user_id: selectedUser, access_level: accessLevel });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Invitar usuario</h2>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">--Selecciona usuario--</option>
        {users.map((u: any) => (
          <option key={u.id} value={u.id}>{u.username}</option>
        ))}
      </select>

      <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
        <option value="viewer">Solo lectura</option>
        <option value="full_access">Acceso completo</option>
      </select>

      <button onClick={handleInvite} className="mt-2 bg-pink-500 text-white px-4 py-2 rounded">
        Invitar
      </button>
    </div>
  );
}
