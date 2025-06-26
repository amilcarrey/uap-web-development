import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBoardPermissions, removeBoardPermission, shareBoard } from "../api";
import { useUserStore } from "../store";
import toast from "react-hot-toast";

type Permission = {
  user: { username: string; id: string };
  role: "owner" | "editor" | "viewer";
};

export default function BoardPermissions({ boardId }: { boardId: string }) {
  const user = useUserStore(s => s.user);
  const queryClient = useQueryClient();
  const [targetUsername, setTargetUsername] = useState("");
  const [roleToAssign, setRoleToAssign] = useState<"editor" | "viewer">("viewer");

  // Traer permisos actuales
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ["boardPermissions", boardId],
    queryFn: () => fetchBoardPermissions(boardId),
  });

  // Para asignar/cambiar permiso
  const assignPerm = useMutation({
  mutationFn: async () => {
    await shareBoard(boardId, targetUsername, roleToAssign);
  },
  onSuccess: () => {
    toast.success("Permiso asignado/actualizado");
    setTargetUsername("");
    queryClient.invalidateQueries({ queryKey: ["boardPermissions", boardId] });
  },
  onError: (e: any) => {
    toast.error(e.message); // esto mostrará el mensaje que lanzó shareBoard
  },
});


  // Para quitar permiso
  const deletePerm = useMutation({
    mutationFn: async (targetUserId: string) => {
      await removeBoardPermission(boardId, targetUserId);
    },
    onSuccess: () => {
      toast.success("Permiso eliminado");
      queryClient.invalidateQueries({ queryKey: ["boardPermissions", boardId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <p>Cargando permisos...</p>;
  const isOwner = permissions.find((p: Permission) => p.user.username === user?.username)?.role === "owner";

  return (
    <div className="p-4 bg-white rounded shadow my-6">
      <h3 className="font-bold mb-2">Permisos de este tablero</h3>
      <ul>
        {permissions.map((perm: Permission) => (
          <li key={perm.user.id} className="flex justify-between items-center border-b py-1">
            <span>
              {perm.user.username} — <strong>{perm.role}</strong>
            </span>
            {isOwner && perm.role !== "owner" && (
              <button
                onClick={() => deletePerm.mutate(perm.user.id)}
                className="text-red-600 text-sm"
              >
                Quitar
              </button>
            )}
          </li>
        ))}
      </ul>
      {isOwner && (
        <form
          className="mt-4 flex gap-2 items-center"
          onSubmit={e => {
            e.preventDefault();
            assignPerm.mutate();
          }}
        >
          <input
            type="text"
            placeholder="Usuario"
            value={targetUsername}
            onChange={e => setTargetUsername(e.target.value)}
            className="border px-2 py-1 rounded"
            required
          />
          <select
            value={roleToAssign}
            onChange={e => setRoleToAssign(e.target.value as "editor" | "viewer")}
            className="border px-2 py-1 rounded"
          >
            <option value="editor">Editor</option>
            <option value="viewer">Solo lectura</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
            disabled={!targetUsername}
          >
            Compartir
          </button>
        </form>
      )}
    </div>
  );
}