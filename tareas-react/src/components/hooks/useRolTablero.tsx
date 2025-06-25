import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useRolTablero(tableroId: string) {
  return useQuery({
    queryKey: ["rol", tableroId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8008/api/tableros/${tableroId}/rol`,
        { withCredentials: true }
      );
      return res.data.rol;
    },
    enabled: !!tableroId,
  });
}