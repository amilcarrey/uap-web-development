import React from "react";
import type { User } from "../types/api";

interface SelectedUsersListProps {
  selectedUsers: User[];
  onRemoveUser: (user: User) => void;
  title?: string;
}

export const SelectedUsersList: React.FC<SelectedUsersListProps> = ({
  selectedUsers,
  onRemoveUser,
  title = "Selected users",
}) => {
  if (selectedUsers.length === 0) return null;

  return (
    <div className="bg-amber-950/30 p-4 rounded border border-amber-700">
      <label className="block text-sm font-medium text-amber-200 mb-2">
        {title} ({selectedUsers.length})
      </label>
      <div className="space-y-1">
        {selectedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-amber-800/30 px-3 py-2 rounded-md border border-amber-600"
          >
            <div>
              <span className="text-sm font-medium text-amber-100">
                {user.username}
              </span>
              <span className="text-xs text-amber-300 ml-2">
                ({user.email})
              </span>
            </div>
            <button
              onClick={() => onRemoveUser(user)}
              className="text-amber-400 hover:text-red-400 transition-colors"
              title="Remove user"
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
  );
};
