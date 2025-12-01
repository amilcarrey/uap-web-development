
import { useQuery } from "@tanstack/react-query";
import { boardService } from "../services/boardServices";

interface UseBoardsOptions {
    enabled?: boolean; // Para controlar si la consulta está habilitada
}

export function useBoards(options: UseBoardsOptions = {}) {
    const { enabled = true } = options;

    return useQuery({
        queryKey: ['boards'],
        queryFn: () => boardService.getAllBoards(),
        staleTime: 5 * 60 * 1000, // 5 minutos de caché
        enabled,
    });

    // return useQuery({
    //     queryKey: ['boards'],
    //     queryFn: async () => {
    //         const response = await fetch(`${BASE_URL}/boards`, {
    //             method: 'GET',
    //             headers: { 'Content-Type': 'application/json' },
    //             credentials: 'include', // Asegurarse de enviar cookies para autenticación
    //         });

    //         if (!response.ok) {
    //             throw new Error('Error al cargar los tableros');
    //         }

    //         const data = await response.json();
    //         console.log("Boards fetched:", data);
    //         return data as Board[];
    //     },
    //     enabled,
    // })
}