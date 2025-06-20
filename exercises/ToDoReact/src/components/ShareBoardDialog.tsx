import React, { useState } from "react";
import type { User } from "../types/api";
import { usePermissions } from "../hooks/usePermissions";

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
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = getAllUsers();

  const handleShare = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const userEmails = selectedUsers.map((user) => user.email);
      await shareBoard.mutateAsync({
        boardId,
        userEmails,
      });

      // Reset form and close dialog
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error("Failed to share board:", error);
      // Error will be displayed in the error section below
      // The mutation error will be automatically caught by React Query
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

  const isUserSelected = (user: User) => {
    return selectedUsers.some((u) => u.id === user.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Share "{boardName}"
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* User selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select users to share with
            </label>

            {usersLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">Loading users...</div>
              </div>
            )}

            {usersError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  {usersError instanceof Error
                    ? usersError.message
                    : "Failed to load users"}
                </p>
              </div>
            )}

            {!usersLoading && !usersError && users.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  No other users available to share with
                </p>
              </div>
            )}

            {!usersLoading && !usersError && users.length > 0 && (
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserToggle(user)}
                    className={`w-full px-3 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                      isUserSelected(user)
                        ? "bg-purple-50 border-purple-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                      {isUserSelected(user) && (
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected users summary */}
          {selectedUsers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected users ({selectedUsers.length})
              </label>
              <div className="space-y-1">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between bg-purple-50 px-3 py-2 rounded-md"
                  >
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {user.username}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({user.email})
                      </span>
                    </div>
                    <button
                      onClick={() => handleUserToggle(user)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={selectedUsers.length === 0 || shareBoard.isPending}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {shareBoard.isPending
              ? "Sharing..."
              : `Share with ${selectedUsers.length} user${
                  selectedUsers.length !== 1 ? "s" : ""
                }`}
          </button>
        </div>

        {/* Error handling */}
        {shareBoard.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm font-medium text-red-800 mb-1">
              Error al compartir:
            </p>
            <p className="text-sm text-red-600">
              {shareBoard.error instanceof Error
                ? shareBoard.error.message
                : "Failed to share board"}
            </p>
          </div>
        )}

        {/* Development: Test invalid token */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-700 mb-2">
            🔧 Debug: Test token errors
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const original = localStorage.getItem("token");
                localStorage.setItem("token", "invalid-token");
                alert("Token set to invalid for 5 seconds");
                setTimeout(() => {
                  if (original) localStorage.setItem("token", original);
                  else localStorage.removeItem("token");
                  alert("Token restored");
                }, 5000);
              }}
              className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
            >
              Test Invalid Token (5s)
            </button>
            <button
              onClick={() => {
                const original = localStorage.getItem("token");
                localStorage.removeItem("token");
                alert("Token removed for 5 seconds");
                setTimeout(() => {
                  if (original) localStorage.setItem("token", original);
                  alert("Token restored");
                }, 5000);
              }}
              className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
            >
              Test Missing Token (5s)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
