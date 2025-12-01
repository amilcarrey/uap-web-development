import {useQuery} from '@tanstack/react-query';
import { useAppSelector } from '../store/hooks';
import { useAuth } from '../context/AuthContext';
import { todoService } from '../services/todoService';


interface TodoQueryParams {
  boardId?: number
  filter?: 'all' | 'completed' | 'uncompleted';
  page?: number;
  limit?: number;
  search?: string; // ✅ Corregido: string en lugar de number
  enabled?: boolean; // Para controlar si la consulta está habilitada
}

/**
 * Hook para obtener tareas con filtro.
 * @param filter Filtro específico para las tareas. Si no se proporciona, usa el filtro del contexto.
 */
export function useTodos(params: TodoQueryParams = {}) { 

  const reduxFilter = useAppSelector((state) => state.ui.filter); 
  const currentBoardId = useAppSelector((state) => state.ui.currentBoardId);
  const searchText = useAppSelector((state) => state.ui.searchText);
  
  // ✅ Obtener configuraciones del usuario autenticado
  const { settings } = useAuth();
  
  // ✅ Usar todos_per_page de las configuraciones del usuario, con fallback
  const defaultTodosPerPage = settings?.todos_per_page || 10;

  let {
    boardId = currentBoardId,
    filter = reduxFilter,
    page = 1, 
    limit = defaultTodosPerPage, // ✅ Usar valor de configuraciones del usuario
    search = searchText,
    enabled = true 
  } = params;
  
  // ✅ Usar refresh_interval de las configuraciones del usuario para refetch
  const refetchInterval = settings?.refresh_interval || 5000;


  
  return useQuery({
    queryKey: ['todos', boardId, filter, page, limit, search],
    queryFn: async () => {
      console.log("useTodos filter:", filter);
      
      if (!boardId) {
        throw new Error('No board selected. Please select a board first.');
      }

      // ✅ Usar todoService en lugar de fetch directo
      const params = {
        filter,
        page,
        limit,
        ...(search && { search: String(search) }) // Asegurar que search sea string
      };

      const data = await todoService.getAllTodos(boardId, params);
      console.log("Todos fetched:", data);
      return data;
    },
    enabled: enabled && !!boardId, // Solo habilitar si hay boardId
    // Usar el intervalo de refetch desde la configuración global
    refetchInterval
  });
}