import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export const useBoards = () => {
  
  //const { token } = useAuth();
  //console.log("useBoards token", token);
  return useQuery({
    queryKey: ["boards"],
    //enabled: !!token,
    queryFn: async () => {

      const res = await fetch("http://localhost:3000/api/board/user", {
        method: "GET",
        credentials: "include",
      });

      //if (!res.ok) throw new Error("Error al obtener tableros");
      if (!res.ok) {
        // If the response is not ok, we throw an error to be handled by React Query
        throw new Error("Error fetching boards");
      }

      const data = await res.json();
      return data.boards;
    },
    //staleTime: Infinity, //foreveeer
  });
};
