import React, { useState } from "react";
import type { User } from "../types/api";
import { usePermissions } from "../hooks/usePermissions";
import { useNotifications } from "../store/clientStore";
import GorgeousButton from "./GorgeousButton";
import { PermissionsList } from "./PermissionsList";

interface ShareBoardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  boardName: string;
}

export const ShareBoardDialog: React.FC<ShareBoardDialogProps> = ({
  isOpen,
  onClose,
  boardId,
  boardName,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { shareBoard, getAllUsers } = usePermissions();
  const { showSuccess } = useNotifications();

  // Get users data
  const { data: users = [], isLoading: usersLoading } = getAllUsers();

  const handleShare = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const userEmails = selectedUsers.map((user) => user.email);
      await shareBoard.mutateAsync({
        boardId,
        userEmails,
      });

      const userNames = selectedUsers.map((user) => user.username).join(", ");
      showSuccess(
        "Board compartido con éxito",
        `El board "${boardName}" se compartió con: ${userNames}`
      );

      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error("Failed to share board:", error);
    }
  };

  const handleUserToggle = (user: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-orange-950 border-4 border-amber-300 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header decorativo */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-amber-800/30 px-4 py-2 rounded-full border border-amber-400">
            <h2 className="text-lg font-bold text-amber-200">Share Tab</h2>
          </div>
        </div>

        {/* Board name */}
        <div className="text-center mb-6">
          <div className="bg-amber-900/50 p-3 rounded border border-amber-600">
            <p className="text-amber-200 font-medium">"{boardName}"</p>
            <p className="text-amber-300 text-sm mt-1">
              Select users to share this tab with
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* User selection using PermissionsList in select mode */}
          <PermissionsList
            mode="select"
            users={users}
            selectedUsers={selectedUsers}
            isLoading={usersLoading}
            onUserToggle={handleUserToggle}
            title="Select users to share with"
            emptyMessage="No other users available to share with"
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <GorgeousButton onClick={onClose}>Cancel</GorgeousButton>
          <GorgeousButton
            onClick={handleShare}
            disabled={selectedUsers.length === 0 || shareBoard.isPending}
            variant="green"
          >
            {shareBoard.isPending
              ? "Sharing..."
              : `Share with ${selectedUsers.length} user${
                  selectedUsers.length !== 1 ? "s" : ""
                }`}
          </GorgeousButton>
        </div>

        {/* Error handling */}
        {shareBoard.error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-400 rounded-md">
            <p className="text-sm font-medium text-red-300 mb-1">
              Error al compartir:
            </p>
            <p className="text-sm text-red-200">
              {shareBoard.error instanceof Error
                ? shareBoard.error.message
                : "Failed to share board"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
