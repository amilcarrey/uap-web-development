import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, categoriaId }: { text: string; categoriaId: string }) => {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 
          Accept: "application/json" },
        credentials: "include", //Enviar cookies con la solicitud
        body: JSON.stringify({ text, categoriaId }),
      });
       if (!res.ok) {
        // podemos mostrar mensaje específico del backend
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al agregar tarea");
      }
      return res.json();
    },
    onError: (_, { categoriaId }) => {
      const previousTasks = queryClient.getQueryData(["tasks", categoriaId]);
      if (previousTasks) {
        queryClient.setQueryData(["tasks", categoriaId], previousTasks);
      }
    },
    onSuccess: (_, { categoriaId }) => {
      queryClient.invalidateQueries({
        //Querés invalidar múltiples variantes de una misma base ("tasks") cuando queryKey es dinámica 
        //predicate en invalidateQueries es una función que recibe cada Query activa y devuelve true
        //  o false dependiendo de si querés invalidarla o no.
        predicate: (query) => // predicate se usa para filtrar las queries que queremos invalidar
          Array.isArray(query.queryKey) && // Verifica que queryKey sea un array
          query.queryKey[0] === "tasks" && //buscamos que el primer elemento sea tasks
          query.queryKey.includes(categoriaId), // 
      });
    },
  });
}
