import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UserPreferences {
  userId: number;
  itemsPerPage: number;
  updateInterval: number;
}

interface UserProfile {
  id: number;
  alias: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/users/profile", {
        credentials: "include",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) throw new Error("Error al obtener perfil");
      return res.json();
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData: {
      firstName: string;
      lastName: string;
    }) => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });
      if (!res.ok) throw new Error("Error al actualizar perfil");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}

export function useUserSettings() {
  return useQuery<UserPreferences>({
    queryKey: ["user-preferences"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/preferences", {
        credentials: "include",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) throw new Error("Error al obtener configuraciones");
      return res.json();
    },
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Partial<UserPreferences>) => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Error al actualizar configuraciones");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-preferences"] });
    },
  });
}

export function useSearchUsers(searchTerm: string) {
  return useQuery<
    { id: number; alias: string; firstName: string; lastName: string }[]
  >({
    queryKey: ["search-users", searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/users/search?q=${encodeURIComponent(
          searchTerm
        )}`,
        {
          credentials: "include",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!res.ok) throw new Error("Error al buscar usuarios");
      const result = await res.json();
      return result;
    },
    enabled: searchTerm.length >= 2,
  });
}

export function useAllUsers() {
  return useQuery<
    { id: number; alias: string; firstName: string; lastName: string }[]
  >({
    queryKey: ["all-users"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://localhost:3000/api/users?limit=50&offset=0",
          {
            credentials: "include",
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        let users: any[] = [];

        if (data.users && Array.isArray(data.users)) {
          users = data.users;
        } else if (Array.isArray(data)) {
          users = data;
        } else {
          console.warn("⚠️ Estructura de respuesta inesperada:", data);
          users = [];
        }

        return users;
      } catch (error) {
        console.error("❌ Error obteniendo usuarios:", error);

        return await getFallbackUsers(token);
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

async function getFallbackUsers(token: string | null) {
  const commonTerms = ["a", "e", "i", "o", "u", "user", "admin", "test"];
  const allUsers = new Map();

  for (const term of commonTerms) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/search?q=${term}`,
        {
          credentials: "include",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (res.ok) {
        const users = await res.json();
        users.forEach((user: any) => {
          allUsers.set(user.id, user);
        });
      }
    } catch (error) {
      console.warn(`⚠️ Error en fallback con término "${term}":`, error);
    }
  }

  const finalUsers = Array.from(allUsers.values());

  return finalUsers;
}

export function useBoardSharedUsers(boardId: string) {
  return useQuery<
    {
      id: number;
      alias: string;
      firstName: string;
      lastName: string;
      permissionId?: number;
      level?: string;
    }[]
  >({
    queryKey: ["board-shared-users", boardId],
    queryFn: async () => {
      if (!boardId) return [];

      const token = localStorage.getItem("token");
      const timestamp = Date.now();
      const res = await fetch(
        `http://localhost:3000/api/boards/${boardId}/permissions?_t=${timestamp}`,
        {
          credentials: "include",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return [];
        }
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        return data.map((permission) => {
          const level = permission.level || permission.permissionLevel;

          const userInfo = permission.user || permission;

          const mappedUser = {
            id: userInfo.id || permission.userId,
            alias: userInfo.alias || userInfo.userName || userInfo.name || "",
            firstName: userInfo.firstName || userInfo.first_name || "",
            lastName: userInfo.lastName || userInfo.last_name || "",
            permissionId: permission.id,
            level: level || "VIEWER",
          };

          if (
            !mappedUser.alias &&
            (mappedUser.firstName || mappedUser.lastName)
          ) {
            mappedUser.alias =
              `${mappedUser.firstName} ${mappedUser.lastName}`.trim();
          }

          return mappedUser;
        });
      }

      return data.permissions || data.users || [];
    },
    enabled: !!boardId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useUpdateBoardPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      boardId,
      userId,
      newLevel,
    }: {
      boardId: string;
      userId: number;
      newLevel: "OWNER" | "EDITOR" | "VIEWER";
    }) => {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/boards/${boardId}/permissions/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
          body: JSON.stringify({ newLevel }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || `Error ${response.status}`
        );
      }

      const result = await response.json();
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board-shared-users", variables.boardId],
      });
    },
  });
}
