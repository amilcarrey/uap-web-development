import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';

export interface Tab {
  id: string;
  title: string;
  userRole?: 'owner' | 'editor' | 'viewer'; // Agregar rol del usuario
}

// Función helper para obtener headers de autenticación
function getAuthHeaders() {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Intentar obtener token de localStorage
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    headers['Authorization'] = `Bearer ${storedToken}`;
  }
  
  return headers;
}

// --- Funciones de fetch ---

// Obtener todos los tableros CON información de roles
async function fetchTabs(): Promise<Tab[]> {
  const timestamp = Date.now(); // Cache busting
  const res = await fetch(`http://localhost:3000/api/boards?_t=${timestamp}`, {
    credentials: 'include',
    headers: {
      ...getAuthHeaders(),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Error al obtener tableros:', res.status, errorText);
    throw new Error(`Error ${res.status}: ${errorText || 'Error al obtener tableros'}`);
  }
  const data = await res.json();
  
  return data.map((board: any) => ({
    id: board.id.toString(), 
    title: board.name,
    // Usar userRole del backend directamente
    userRole: board.userRole?.toLowerCase() as 'owner' | 'editor' | 'viewer' || 'viewer'
  }));
}

// Crear tablero
async function createTabRequest(title: string): Promise<Tab> {
  const res = await fetch('http://localhost:3000/api/boards', {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ action: 'create', name: title }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Error al crear tablero:', res.status, errorText);
    throw new Error(`Error al crear tablero: ${res.status} - ${errorText}`);
  }
  
  const data = await res.json();
  
  // Verificar estructura de respuesta y manejar diferentes formatos
  let result;
  
  if (data.tab && data.tab.id && data.tab.name) {
    // Formato esperado: { tab: { id, name } }
    result = {
      id: data.tab.id.toString(),
      title: data.tab.name,
      userRole: 'owner' as const
    };
  } else if (data.id && data.name) {
    // Formato alternativo: { id, name }
    result = {
      id: data.id.toString(),
      title: data.name,
      userRole: 'owner' as const
    };
  } else if (data.board && data.board.id && data.board.name) {
    // Formato alternativo: { board: { id, name } }
    result = {
      id: data.board.id.toString(),
      title: data.board.name,
      userRole: 'owner' as const
    };
  } else {
    console.error('❌ Estructura de respuesta no reconocida al crear tablero:', data);
    // Intentar usar el primer objeto con id y name que encontremos
    const foundObj = Object.values(data).find((obj: any) => obj && obj.id && obj.name);
    if (foundObj) {
      result = {
        id: (foundObj as any).id.toString(),
        title: (foundObj as any).name,
        userRole: 'owner' as const
      };
    } else {
      throw new Error('Estructura de respuesta del backend no válida: no se encontró id y name');
    }
  }
  
  return result;
}

// Eliminar tablero
async function deleteTabRequest(boardId: string): Promise<any> {
  const url = `http://localhost:3000/api/boards/${boardId}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Error al eliminar tablero:', res.status, errorText);
    throw new Error(`Error al eliminar tablero: ${res.status} - ${errorText}`);
  }
  
  // Manejar respuestas vacías o diferentes formatos
  let result;
  const contentType = res.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    try {
      result = await res.json();
    } catch (e) {
      // Si no se puede parsear JSON pero la respuesta fue exitosa, está bien
      result = { success: true };
    }
  } else {
    // Respuesta no JSON pero exitosa
    result = { success: true };
  }
  
  return result;
}

// Renombrar tablero
async function renameTabRequest({ id, newTitle }: { id: string; newTitle: string }): Promise<Tab> {
  const res = await fetch(`http://localhost:3000/api/boards/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ action: 'rename', name: newTitle }),
  });
  if (!res.ok) throw new Error('Error al renombrar tablero');
  const data = await res.json();
  return {
    id: data.id.toString(),
    title: data.name,
    userRole: data.userRole || 'owner'
  };
}

// --- Hooks (sin cambios en la estructura) ---

export function useTabs() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  
  return useQuery<Tab[]>({
    queryKey: ['tabs'],
    queryFn: fetchTabs,
    initialData: [],
    gcTime: 0, // No guardar en cache
    staleTime: 0, // Siempre considerar obsoleto
    refetchInterval: 5000, // Refetch cada 5 segundos
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: isAuthenticated && !isLoading, // Solo ejecutar cuando esté autenticado y no cargando
    retry: (failureCount, error) => {
      // Si es un 401, no reintentar (problema de autenticación)
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        console.log('Error 401 detectado, no reintentando consulta de tableros');
        return false;
      }
      // Para otros errores, reintentar hasta 2 veces
      return failureCount < 2;
    },
    retryDelay: 1000, // Esperar 1 segundo antes de reintentar
  });
}

export function useCreateTab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTabRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabs'] });
    },
  });
}

export function useDeleteTab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTabRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabs'] });
    },
  });
}

export function useRenameTab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: renameTabRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabs'] });
    },
  });
}

