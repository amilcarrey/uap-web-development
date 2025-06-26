import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../hooks/useTasks";
import { useAuth } from "../hooks/useAuth";
import { useCurrentUser } from "../hooks/useCurrentUser";


type ShareBoardModalProps = {
  boardId: string;
  onClose: () => void;
};

export function ShareBoardModal({ boardId, onClose }: ShareBoardModalProps) {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/auth`, {
        method: "GET",
        credentials: "include"
    });
      const data = await response.json();
      return data.users;
    },
  });

  const { data: currentUser } = useCurrentUser();
  const filteredUsers = users.filter((user: any) => user.id !== currentUser?.id);

  const { mutate: shareBoard } = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: "owner" | "editor" | "viewer";
    }) => {
      const response = await fetch(`${BASE_URL}/boards/share`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ boardId, targetUserId: userId, role }),
      });

      if (!response.ok) throw new Error("Failed to share board");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Share Board</h2>
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {filteredUsers.map((user: any) => (
            <li key={user.id} className="flex justify-between items-center">
              <span>{user.email}</span>
              <div className="space-x-2">
                <button onClick={() => shareBoard({ userId: user.id, role: "editor" })} className="text-blue-600">
                  Editor
                </button>
                <button onClick={() => shareBoard({ userId: user.id, role: "viewer" })} className="text-gray-600">
                  Viewer
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 text-red-500">Cerrar</button>
      </div>
    </div>
  );
}
