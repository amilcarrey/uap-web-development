import React from "react";
import { usePermissions } from "../hooks/usePermissions";

interface BoardPermissionsProps {
  boardId: string;
  boardName: string;
  currentUserPermission: "owner" | "editor" | "viewer";
}

export const BoardPermissions: React.FC<BoardPermissionsProps> = ({
  boardId,
  boardName,
  currentUserPermission,
}) => {
  const { getBoardPermissions, revokeAccess } = usePermissions();
  const { data: permissions = [], isLoading } = getBoardPermissions(boardId);

  const handleRevokeAccess = async (userId: string, username: string) => {
    if (
      window.confirm(
        `Are you sure you want to revoke ${username}'s access to this board?`
      )
    ) {
      try {
        await revokeAccess.mutateAsync({ boardId, userId });
      } catch (error) {
        console.error("Failed to revoke access:", error);
      }
    }
  };

  const getPermissionBadgeColor = (level: string) => {
    switch (level) {
      case "owner":
        return "bg-blue-100 text-blue-800";
      case "editor":
        return "bg-green-100 text-green-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (currentUserPermission !== "owner") {
    return null; // Only owners can manage permissions
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Board Access - "{boardName}"
      </h3>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="text-gray-500">Loading permissions...</div>
        </div>
      ) : permissions.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-gray-500">
            No one else has access to this board
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {permissions.map((permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {permission.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {permission.username}
                  </div>
                  <div className="text-xs text-gray-500">
                    {permission.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getPermissionBadgeColor(
                    permission.permission_level
                  )}`}
                >
                  {permission.permission_level}
                </span>

                {permission.permission_level !== "owner" && (
                  <button
                    onClick={() =>
                      handleRevokeAccess(
                        permission.user_id,
                        permission.username
                      )
                    }
                    disabled={revokeAccess.isPending}
                    className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {revokeAccess.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            {revokeAccess.error instanceof Error
              ? revokeAccess.error.message
              : "Failed to revoke access"}
          </p>
        </div>
      )}
    </div>
  );
};
