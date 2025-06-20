import React from "react";
import type { BoardPermission, User } from "../types/api";
import { Trash } from "lucide-react";

// Extended type that includes user details from API response
type BoardPermissionWithUser = BoardPermission & {
  username: string;
  email: string;
};

interface BaseProps {
  isLoading: boolean;
  title?: string;
  emptyMessage?: string;
}

type PermissionsListProps = (
  | {
      // Mode for permissions (existing functionality)
      mode?: "permissions";
      permissions: BoardPermissionWithUser[];
      onRevokeAccess: (userId: string, username: string) => void;
      isPending?: boolean;
    }
  | {
      // Mode for user selection (new functionality)
      mode: "select";
      users: User[];
      selectedUsers: User[];
      onUserToggle: (user: User) => void;
    }
) &
  BaseProps;

export const PermissionsList: React.FC<PermissionsListProps> = (props) => {
  const { isLoading, title, emptyMessage } = props;

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="text-amber-300">Loading...</div>
      </div>
    );
  }

  // Permissions mode (existing functionality)
  if (props.mode !== "select") {
    const { permissions, onRevokeAccess, isPending = false } = props;

    if (permissions.length === 0) {
      return (
        <div className="text-center py-4">
          <div className="text-amber-300">
            {emptyMessage || "No one else has access to this board"}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {title && (
          <h3 className="text-sm font-medium text-amber-200 mb-3">{title}</h3>
        )}
        {permissions.map((permission) => (
          <div
            key={permission.user_id}
            className="bg-amber-800/30 p-3 rounded border border-amber-600 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-amber-800 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-sm font-medium text-amber-100">
                  {permission.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-amber-100">
                  {permission.username}
                </div>
                <div className="text-xs text-amber-300">{permission.email}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  permission.permission_level === "owner"
                    ? "bg-blue-900 text-blue-200"
                    : permission.permission_level === "editor"
                    ? "bg-green-900 text-green-200"
                    : "bg-amber-800 text-amber-200"
                }`}
              >
                {permission.permission_level}
              </span>

              {permission.permission_level !== "owner" && (
                <button
                  onClick={() =>
                    onRevokeAccess(permission.user_id, permission.username)
                  }
                  disabled={isPending}
                  className="text-red-500 hover:text-red-300"
                  title="Revoke access"
                >
                  <Trash className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Select mode (new functionality)
  const { users, selectedUsers, onUserToggle } = props;

  if (users.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-amber-300">
          {emptyMessage || "No users available"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {title && (
        <h3 className="text-sm font-medium text-amber-200 mb-3">{title}</h3>
      )}
      {users.map((user) => {
        const isSelected = selectedUsers.some((u) => u.id === user.id);
        return (
          <div
            key={user.id}
            onClick={() => onUserToggle(user)}
            className={`p-3 rounded border cursor-pointer transition-colors ${
              isSelected
                ? "bg-amber-700/50 border-amber-500 text-amber-100"
                : "bg-amber-800/30 border-amber-600 hover:bg-amber-700/30 text-amber-200"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-amber-800 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-sm font-medium text-amber-100">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{user.username}</div>
                <div className="text-xs text-amber-300">{user.email}</div>
              </div>
              {isSelected && (
                <div className="text-amber-300">
                  <Trash />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
