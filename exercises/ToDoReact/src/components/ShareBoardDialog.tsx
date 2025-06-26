import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "../types/api";
import { usePermissions } from "../hooks/usePermissions";
import { useNotifications } from "../store/clientStore";
import GorgeousButton from "./GorgeousButton";
import { PermissionsList } from "./PermissionsList";
import { debugAuth, debugBoards, debugPermissions } from "../utils/debugAuth";

// Make debug functions available globally for debugging
(window as any).debugAuth = debugAuth;
(window as any).debugBoards = debugBoards;
(window as any).debugPermissions = debugPermissions;

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
  const [isUpdating, setIsUpdating] = useState(false);
  const { shareBoard, getAllUsers, getBoardPermissions } = usePermissions();
  const { showSuccess } = useNotifications();
  const queryClient = useQueryClient();

  // Get users data
  const { data: users = [], isLoading: usersLoading } = getAllUsers();

  // Get current board permissions to pre-select already shared users
  const { data: boardPermissions = [], isLoading: permissionsLoading } =
    getBoardPermissions(boardId);

  // Pre-select users who already have access to the board
  useEffect(() => {
    if (
      isOpen && // Only run when dialog is open
      !permissionsLoading &&
      boardPermissions.length > 0 &&
      users.length > 0
    ) {
      console.log("🔄 Pre-selecting users with existing permissions...");
      console.log("👥 Board permissions:", boardPermissions);
      debugPermissions(boardId);

      // Find users who already have permissions (excluding the owner)
      const usersWithPermissions = users.filter((user) =>
        boardPermissions.some(
          (permission) =>
            permission.user_id === user.id &&
            permission.permission_level !== "owner"
        )
      );

      console.log("✅ Pre-selected users:", usersWithPermissions);

      // Only update if the selection actually changed to avoid infinite loops
      setSelectedUsers((prev) => {
        const prevIds = prev.map((u) => u.id).sort();
        const newIds = usersWithPermissions.map((u) => u.id).sort();

        if (JSON.stringify(prevIds) !== JSON.stringify(newIds)) {
          console.log(
            "🔄 Updating selected users from",
            prev,
            "to",
            usersWithPermissions
          );
          return usersWithPermissions;
        }
        console.log("✅ Selected users unchanged, skipping update");
        return prev;
      });
    }
  }, [isOpen, boardPermissions, users, permissionsLoading, boardId]);

  // Reset selected users when dialog closes
  useEffect(() => {
    if (!isOpen) {
      console.log("🔄 Dialog closed, resetting selected users");
      setSelectedUsers([]);
      setIsUpdating(false);
    }
  }, [isOpen]);

  const handleShare = async () => {
    if (selectedUsers.length === 0) return;

    console.log("🔄 Starting share process...");
    console.log("📋 Board ID:", boardId);
    console.log("👥 Selected users:", selectedUsers);

    // Debug auth before sharing
    debugAuth();

    setIsUpdating(true);

    try {
      const userEmails = selectedUsers.map((user) => user.email);
      console.log("📧 User emails to share with:", userEmails);

      await shareBoard.mutateAsync({
        boardId,
        userEmails,
      });

      const userNames = selectedUsers.map((user) => user.username).join(", ");
      showSuccess(
        "Board access updated successfully",
        `Access to "${boardName}" updated for: ${userNames}`
      );

      // Force refresh board permissions to ensure UI updates immediately
      await queryClient.invalidateQueries({
        queryKey: ["board-permissions", boardId],
        exact: true,
      });

      // Also refetch to ensure we have the latest data
      await queryClient.refetchQueries({
        queryKey: ["board-permissions", boardId],
        exact: true,
      });

      // Wait a bit for the query to refetch and then reset
      setTimeout(() => {
        setSelectedUsers([]);
        setIsUpdating(false);
        onClose();
      }, 200);
    } catch (error) {
      console.error("❌ Failed to share board:", error);
      // Call debug again to see auth state after error
      debugAuth();
      setIsUpdating(false);
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
      <div className="bg-orange-950 border-4 border-amber-300 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl max-h-[90vh] flex flex-col">
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

            {selectedUsers.length > 0 && (
              <p className="text-amber-400 text-xs mt-1 italic">
                Already shared users appear pre-selected
              </p>
            )}
          </div>
        </div>

        {/* Scrollable user list container */}
        <div className="flex-1 overflow-hidden relative">
          <div className="max-h-64 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-track-amber-900/20 scrollbar-thumb-amber-600 hover:scrollbar-thumb-amber-500">
            {/* User selection using PermissionsList in select mode */}
            <PermissionsList
              mode="select"
              users={users}
              selectedUsers={selectedUsers}
              isLoading={usersLoading || permissionsLoading || isUpdating}
              onUserToggle={handleUserToggle}
            />
          </div>

          {/* Indicador de scroll - aparece solo si hay muchos usuarios */}
          {users.length > 5 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-950 via-orange-950/80 to-transparent h-12 flex items-end justify-center pb-2 pointer-events-none">
              <div className="flex items-center gap-1 text-amber-300 text-xs animate-bounce">
                <span>Ver más usuarios</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <GorgeousButton onClick={onClose}>Cancel</GorgeousButton>
          <GorgeousButton
            onClick={handleShare}
            disabled={
              selectedUsers.length === 0 || shareBoard.isPending || isUpdating
            }
            variant="green"
          >
            {shareBoard.isPending || isUpdating
              ? "Updating..."
              : selectedUsers.length === 0
              ? "Select users"
              : `Update access for ${selectedUsers.length} user${
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
