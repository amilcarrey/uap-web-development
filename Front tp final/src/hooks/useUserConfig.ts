// src/hooks/useUserConfig.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Formato de configuración que maneja el frontend
interface UserConfig {
  id?: number;
  user_id: number;
  refetch_interval: number;
  uppercase_descriptions: boolean;
  task_page_size: number;
}

// Formato de configuración que devuelve el servidor
interface ServerConfig {
  settings: {
    user_id: string;
    refresh_interval: number;
    show_uppercase: boolean;
    task_page_size?: number;
    created_at: string;
    updated_at: string;
  };
}

// ✅ Hook para obtener configuraciones del usuario autenticado
export function useUserConfig() {
  return useQuery({
    queryKey: ["user-config"], // Ya no depende de user_id
    queryFn: async (): Promise<UserConfig> => {
      const response = await fetch(`http://localhost:3000/api/user-settings`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Error al obtener configuraciones del usuario");
      }

      const serverData: ServerConfig = await response.json();

      return {
        id: undefined,
        user_id: parseInt(serverData.settings.user_id.replace("u", "")),
        refetch_interval: serverData.settings.refresh_interval,
        uppercase_descriptions: serverData.settings.show_uppercase,
        task_page_size: serverData.settings.task_page_size ?? 10,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ✅ Hook para actualizar configuraciones del usuario autenticado
export function useUpdateUserConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Partial<UserConfig>) => {
      const serverPayload = {
        refresh_interval: config.refetch_interval,
        show_uppercase: config.uppercase_descriptions,
        task_page_size: config.task_page_size,
      };

      const response = await fetch(`http://localhost:3000/api/user-settings`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serverPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        throw new Error(`Error al actualizar configuraciones`);
      }

      const result: ServerConfig = await response.json();

      return {
        id: undefined,
        user_id: parseInt(result.settings.user_id.replace("u", "")),
        refetch_interval: result.settings.refresh_interval,
        uppercase_descriptions: result.settings.show_uppercase,
        task_page_size: result.settings.task_page_size ?? 10,
      };
    },
    onSuccess: (updatedConfig) => {
      queryClient.setQueryData(["user-config"], updatedConfig);
      queryClient.invalidateQueries({ queryKey: ["user-config"] });
      console.log("Configuración actualizada exitosamente");
    },
    onError: (error) => {
      console.error("Error al actualizar configuración:", error);
    },
  });
}

// ✅ Hook opcional: para limpiar cache del usuario autenticado
export function useClearUserConfigCache() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.removeQueries({ queryKey: ["user-config"] });
  };
}
