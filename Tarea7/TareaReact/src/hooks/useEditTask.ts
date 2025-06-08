import { useMutation, useQueryClient } from "@tanstack/react-query";


const BACKEND_URL = 'http://localhost:4321/api'; // <-- Agrega esta línea


export function useEditTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("action", "edit");
      formData.append("task_content", content);

      const res = await fetch(`${BACKEND_URL}/update-task`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al editar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "tasks",
      });
    },
  });
}
