import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useActualizarTarea(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<{ texto: string; completada: boolean }>) =>
      axios.patch(
        `http://localhost:8008/api/tareas/${id}`,
        {
          ...data,
          fecha_modificacion: new Date().toISOString(),
        },
        { withCredentials: true } 
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      queryClient.invalidateQueries({ queryKey: ["tarea", id] });
    },
  });
}
