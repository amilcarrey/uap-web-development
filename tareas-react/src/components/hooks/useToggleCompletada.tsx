import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useToggleCompletada(id: string, estadoActual: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const ahora = new Date().toISOString();
      const response = await axios.patch(
        `http://localhost:8008/api/tareas/${id}/completar`,
        {
          completada: !estadoActual,
          fecha_modificacion: ahora,
          fecha_realizada: !estadoActual ? ahora : null,
        },
        { withCredentials: true } 
      );
      console.log("Respuesta del backend al completar tarea:", response.data);
      return response;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["tareas"] });

      const previousQueries = queryClient.getQueriesData({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "tareas",
      });

      previousQueries.forEach(([key, data]: any) => {
        console.log("Cache antes de modificar:", key, data);
        if (!data) return;
        if (!data.data || !Array.isArray(data.data.tareas)) {
          console.warn(
            "No hay propiedad 'data.tareas' en el cache para este key:",
            key,
            data
          );
          return;
        }
        const nuevasTareas = data.data.tareas.map((t: any) =>
          t.id === id
            ? {
                ...t,
                completada: !estadoActual,
                fecha_modificacion: new Date().toISOString(),
                fecha_realizada: !estadoActual ? new Date().toISOString() : null,
              }
            : t
        );
        console.log("Cache después de modificar:", nuevasTareas);
        queryClient.setQueryData(key, {
          ...data,
          data: {
            ...data.data,
            tareas: nuevasTareas,
          },
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
