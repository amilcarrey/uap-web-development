import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export interface UserPreferences {
  capitalizeTasks: boolean;
  refreshInterval: number;
}

export const useUserPreferences = () => {
  return useQuery<UserPreferences>({
    queryKey: ["userPreferences"],
    queryFn: async () => {
      const res = await api.get("/auth/preferences");
      return res.data;
    },
  });
};
