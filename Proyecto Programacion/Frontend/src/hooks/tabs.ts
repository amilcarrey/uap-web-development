import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserFromToken, getUserFromJWTString } from '../utils/auth';
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
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    headers['Authorization'] = `Bearer ${storedToken}`;
  }
  
  return headers;
}

// --- Funciones de fetch ---

// Obtener todos los tableros CON información de roles
async function fetchTabs(): Promise<Tab[]> {
  //console.log('Ejecutando fetchTabs: consultando /api/boards');
  const res = await fetch('/api/boards', {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    //console.log('Error al obtener tableros:', res.status);
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText || 'Error al obtener tableros'}`);
  }
  const data = await res.json();
  //console.log('Datos recibidos del backend:', data);
  
  // Obtener el usuario actual del JWT (cookies o localStorage)
  let currentUser = getUserFromToken();
  if (!currentUser) {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      currentUser = getUserFromJWTString(storedToken);
    }
  }
  const currentUserId = currentUser?.id;
  //console.log('Usuario actual para tabs:', currentUser);
  
  return data.map((board: any) => ({
    id: board.id.toString(), 
    title: board.name,
    // Calcular rol: si ownerId === currentUserId entonces es owner, sino colaborador
    userRole: board.ownerId === currentUserId ? 'owner' : 'editor'
  })).map((tab: Tab) => {
    // 🔥 LOG para verificar userRole
    //console.log(`🔄 Tab "${tab.title}" (id: ${tab.id}) tiene userRole: ${tab.userRole}`);
    return tab;
  });
}

// Crear tablero
async function createTabRequest(title: string): Promise<Tab> {
  const res = await fetch('/api/boards', {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ action: 'create', name: title }),
  });
  if (!res.ok) throw new Error('Error al crear tablero');
  const data = await res.json();
  return {
    id: data.tab.id.toString(),
    title: data.tab.name,
    userRole: 'owner' // El creador siempre es owner
  };
}

// Eliminar tablero
async function deleteTabRequest(boardId: string): Promise<any> {

  const url = `/api/boards/${boardId}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al eliminar tablero: ${res.status} - ${errorText}`);
  }
  
  const result = await res.json();
  return result;
}

// Renombrar tablero
async function renameTabRequest({ id, newTitle }: { id: string; newTitle: string }): Promise<Tab> {
  const res = await fetch(`/api/boards/${id}`, {
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
    gcTime: 1,
    staleTime: 1000,
    refetchInterval: 10000,
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

