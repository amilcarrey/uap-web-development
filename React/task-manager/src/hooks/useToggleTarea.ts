import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../store/toastStore";

export function useToggleTarea() {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: async (id: number) => {

      const formData = new FormData();
      formData.append("id", id.toString());

      const res = await fetch(`http://localhost:4321/api/toggle/${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!data.success) {
        console.error("Error desde el backend:", data);
        throw new Error("Error al cambiar el estado de la tarea");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      showToast("Estado de la tarea actualizado correctamente", "success");
    },
    onError: () => {
      showToast("Error al cambiar el estado de la tarea", "error");
    },
  });
}
