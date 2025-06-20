import React from "react";
import type { User } from "../types/api";

interface UserListProps {
  users: User[];
  selectedUsers?: User[];
  isLoading?: boolean;
  error?: Error | null;
  onUserToggle?: (user: User) => void;
  onUserAction?: (user: User, action: string) => void;
  mode?: "select" | "display";
  title?: string;
  emptyMessage?: string;
  showActions?: boolean;
  actionLabel?: string;
  actionVariant?: "revoke" | "edit" | "view";
}

export const UserList: React.FC<UserListProps> = ({
  users,
  selectedUsers = [],
  isLoading = false,
  error = null,
  onUserToggle,
  onUserAction,
  mode = "select",
  title,
  emptyMessage = "No users available",
  showActions = false,
  actionLabel = "Action",
  actionVariant = "view",
}) => {
  const isUserSelected = (user: User) => {
    return selectedUsers.some((u) => u.id === user.id);
  };

  const getActionButtonClass = () => {
    switch (actionVariant) {
      case "revoke":
        return "text-red-400 hover:text-red-300";
      case "edit":
        return "text-amber-400 hover:text-amber-300";
      default:
        return "text-amber-400 hover:text-amber-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-amber-300">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-red-900/50 border border-red-400 rounded-md">
        <p className="text-sm text-red-300">
          {error instanceof Error ? error.message : "Failed to load users"}
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-amber-300">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-amber-950/30 p-4 rounded border border-amber-700">
      {title && (
        <label className="block text-sm font-medium text-amber-200 mb-3">
          {title}
        </label>
      )}

      <div className="max-h-48 overflow-y-auto border border-amber-600 rounded-md bg-amber-900/20">
        {users.map((user) => (
          <div
            key={user.id}
            className={`w-full px-3 py-3 border-b border-amber-700 last:border-b-0 transition-colors ${
              mode === "select"
                ? `cursor-pointer hover:bg-amber-800/30 ${
                    isUserSelected(user)
                      ? "bg-amber-700/40 border-amber-500"
                      : ""
                  }`
                : "bg-amber-900/10"
            }`}
            onClick={
              mode === "select" && onUserToggle
                ? () => onUserToggle(user)
                : undefined
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-amber-100">
                  {user.username}
                </div>
                <div className="text-xs text-amber-300">{user.email}</div>
              </div>

              <div className="flex items-center gap-2">
                {mode === "select" && isUserSelected(user) && (
                  <svg
                    className="w-5 h-5 text-amber-400"
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
                )}

                {showActions && onUserAction && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUserAction(user, actionVariant);
                    }}
                    className={`text-sm px-2 py-1 rounded transition-colors ${getActionButtonClass()}`}
                    title={actionLabel}
                  >
                    {actionVariant === "revoke" && "Remove"}
                    {actionVariant === "edit" && "Edit"}
                    {actionVariant === "view" && "View"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
