import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useEliminarCompletadas(tableroId: string, notificar: (msg: string, tipo?: string) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            // Construye la URL con el query parameter
            const url = `http://localhost:8008/api/tareas?tableroId=${encodeURIComponent(tableroId)}`;
            await axios.delete(url, { withCredentials: true }); 
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tareas"] });
            notificar("Tareas completadas eliminadas", "error");
        },
        onError: () => {
            notificar("Error al eliminar tareas completadas", "error");
        },
    });
}