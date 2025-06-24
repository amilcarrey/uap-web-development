import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useToggleCompletada(id: string, estadoActual: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const ahora = new Date().toISOString();
      return axios.patch(`http://localhost:8008/tareas/${id}`, {
        completada: !estadoActual,
        fecha_modificacion: ahora,
        fecha_realizada: !estadoActual ? ahora : null,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["tareas"] });

      const previousQueries = queryClient.getQueriesData({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "tareas",
      });

      previousQueries.forEach(([key, data]: any) => {
        if (!data) return;
        queryClient.setQueryData(key, {
          ...data,
          tareas: data.tareas.map((t: any) =>
            t.id === id
              ? {
                  ...t,
                  completada: !estadoActual,
                  fecha_modificacion: new Date().toISOString(),
                  fecha_realizada: !estadoActual ? new Date().toISOString() : null,
                }
              : t
          ),
        });
      });

      return { previousQueries };
    },
    onError: (_err, _variables, context: any) => {
      context?.previousQueries?.forEach(([key, data]: any) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
    },
  });
}
