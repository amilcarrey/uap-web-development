import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tablerosAPI } from "../services/tablerosService";
import { tareasAPI } from "../services/tareasService";
import { useConfiguracion } from "../components/Configuraciones";
import toast from "react-hot-toast";

export const useDeleteTablero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await tablerosAPI.deleteTablero(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
      toast.success("Tablero eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar el tablero");
    },
  });
};

export const useTareas = (tableroId: string, filtro: string = "todos") => {
  const { refetchInterval } = useConfiguracion();
  return useQuery({
    queryKey: ["tareas", tableroId, filtro],
    queryFn: async () => {
      if (!tableroId) return [];
      const tareas = await tareasAPI.getTareas(parseInt(tableroId));
      
      // Aplicar filtro
      switch (filtro) {
        case "completadas":
          return tareas.filter(tarea => tarea.completada);
        case "pendientes":
          return tareas.filter(tarea => !tarea.completada);
        default:
          return tareas;
      }
    },
    refetchInterval,
    enabled: !!tableroId,
  });
};
