import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserConfig, updateUserConfig } from "../api";
// import { useConfigStore } from "../store";

export const useUserConfig = () => {
  return useQuery({
    queryKey: ["userConfig"],
    queryFn: fetchUserConfig,
  });
};

export const useUpdateUserConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userConfig"] });
    },
  });
};
