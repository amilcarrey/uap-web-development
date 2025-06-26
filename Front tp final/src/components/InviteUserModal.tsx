// src/components/InviteUserModal.tsx
import { InviteUserDialog } from "./InviteUserDialog";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  users: any[];
}

export function InviteUserModal({ isOpen, onClose, boardId, users }: InviteUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px] max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Invitar Usuario</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <InviteUserDialog
          boardId={boardId}
          users={users}
          onClose={onClose}
        />
        
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
