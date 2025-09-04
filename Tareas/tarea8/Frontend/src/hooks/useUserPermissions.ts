import { useState, useEffect } from "react";
import { useTabs } from "./tabs";

interface UserPermission {
  isViewer: boolean;
  isEditor: boolean;
  isOwner: boolean;
  permissionLevel: "OWNER" | "EDITOR" | "VIEWER" | null;
}

export function useUserPermissions(boardId: string): UserPermission {
  const [permissions, setPermissions] = useState<UserPermission>({
    isViewer: false,
    isEditor: false,
    isOwner: false,
    permissionLevel: null,
  });

  const { data: tabs } = useTabs();

  useEffect(() => {
    const detectPermissions = async () => {
      const token = localStorage.getItem("token");

      if (!token || !boardId) {
        setPermissions({
          isViewer: false,
          isEditor: false,
          isOwner: false,
          permissionLevel: null,
        });
        return;
      }

      if (tabs && tabs.length > 0) {
        const currentTab = tabs.find((tab) => tab.id === boardId);
        if (currentTab && currentTab.userRole) {
          const level = currentTab.userRole.toUpperCase();

          const newPermissions = {
            isViewer: level === "VIEWER",
            isEditor: level === "EDITOR",
            isOwner: level === "OWNER",
            permissionLevel: level as "OWNER" | "EDITOR" | "VIEWER",
          };

          setPermissions(newPermissions);
          return;
        }
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        const boardPermission = payload.boardPermissions?.find((perm: any) => {
          const permBoardId = String(perm.boardId);
          const targetBoardId = String(boardId);
          return permBoardId === targetBoardId;
        });

        if (boardPermission) {
          const level = boardPermission.permission?.toUpperCase();

          const newPermissions = {
            isViewer: level === "VIEWER",
            isEditor: level === "EDITOR",
            isOwner: level === "OWNER",
            permissionLevel: level as "OWNER" | "EDITOR" | "VIEWER",
          };

          setPermissions(newPermissions);
        } else {
          try {
            const response = await fetch(
              `http://localhost:3000/api/boards/${boardId}/permissions/me`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }
            );

            if (response.ok) {
              const permissionData = await response.json();

              const level = permissionData.permission?.toUpperCase();

              if (level) {
                const newPermissions = {
                  isViewer: level === "VIEWER",
                  isEditor: level === "EDITOR",
                  isOwner: level === "OWNER",
                  permissionLevel: level as "OWNER" | "EDITOR" | "VIEWER",
                };

                setPermissions(newPermissions);
              } else {
                setPermissions({
                  isViewer: false,
                  isEditor: true,
                  isOwner: true,
                  permissionLevel: "OWNER",
                });
              }
            } else {
              setPermissions({
                isViewer: false,
                isEditor: true,
                isOwner: true,
                permissionLevel: "OWNER",
              });
            }
          } catch (fetchError) {
            setPermissions({
              isViewer: false,
              isEditor: true,
              isOwner: true,
              permissionLevel: "OWNER",
            });
          }
        }
      } catch (error) {
        setPermissions({
          isViewer: false,
          isEditor: false,
          isOwner: false,
          permissionLevel: null,
        });
      }
    };

    detectPermissions();
  }, [boardId, tabs]);

  return permissions;
}

export function useIsViewer(boardId: string): boolean {
  const { isViewer } = useUserPermissions(boardId);
  return isViewer;
}
