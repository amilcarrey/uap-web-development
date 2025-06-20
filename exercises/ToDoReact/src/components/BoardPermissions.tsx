import React from "react";
import { usePermissions } from "../hooks/usePermissions";
import { PermissionsList } from "./PermissionsList";

interface BoardPermissionsProps {
  boardId: string;
  boardName: string;
  currentUserPermission: "owner" | "editor" | "viewer";
}

export const BoardPermissions: React.FC<BoardPermissionsProps> = ({
  boardId,

  currentUserPermission,
}) => {
  const { getBoardPermissions, revokeAccess } = usePermissions();
  const { data: permissions = [], isLoading } = getBoardPermissions(boardId);

  const handleRevokeAccess = async (userId: string) => {
    {
      try {
        await revokeAccess.mutateAsync({ boardId, userId });
      } catch (error) {
        console.error("Failed to revoke access:", error);
      }
    }
  };

  if (currentUserPermission !== "owner") {
    return null; //JUST THE OWNER OF THE TAB CAN MANAGE PERMISSIONS. UNDERSTOOD MATE!!!!!!
  }

  return (
    <div>
      <PermissionsList
        permissions={permissions}
        isLoading={isLoading}
        onRevokeAccess={handleRevokeAccess}
        isPending={revokeAccess.isPending}
      />

      {revokeAccess.error && (
        <div className="mt-4 p-3 bg-red-900/60 border border-red-400 rounded-md">
          <p className="text-sm text-red-200">
            {revokeAccess.error instanceof Error
              ? revokeAccess.error.message
              : "Failed to revoke access"}
          </p>
        </div>
      )}
    </div>
  );
};
