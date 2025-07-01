import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Estructura de configuraciones del usuario
interface UserPreferences {
  userId: number;
  itemsPerPage: number;
  updateInterval: number;
}

// Estructura del perfil de usuario completo (con datos del backend)
interface UserProfile {
  id: number;
  alias: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ Obtener perfil del usuario desde /api/users/profile
export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/profile', {
        credentials: 'include',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) throw new Error('Error al obtener perfil');
      return res.json();
    },
  });
}

// ✅ Actualizar perfil del usuario usando /api/users/profile
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData: { firstName: string; lastName: string }) => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });
      if (!res.ok) throw new Error('Error al actualizar perfil');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}

// ✅ Obtener configuraciones del usuario (usando /api/preferences)
export function useUserSettings() {
  return useQuery<UserPreferences>({
    queryKey: ['user-preferences'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/preferences', {
        credentials: 'include',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) throw new Error('Error al obtener configuraciones');
      return res.json();
    },
  });
}

// ✅ Actualizar configuraciones del usuario
export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Partial<UserPreferences>) => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Error al actualizar configuraciones');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    },
  });
}

// ✅ Buscar usuarios (usando /api/users/search)
export function useSearchUsers(searchTerm: string) {
  return useQuery<{ id: number; alias: string; firstName: string; lastName: string }[]>({
    queryKey: ['search-users', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`, {
        credentials: 'include',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) throw new Error('Error al buscar usuarios');
      const result = await res.json();
      console.log('🔍 Resultados de búsqueda:', result.map((u: any) => `${u.alias}(id:${u.id})`));
      return result;
    },
    enabled: searchTerm.length >= 2,
  });
}

// ✅ Obtener todos los usuarios disponibles (usando el nuevo endpoint /api/users)
export function useAllUsers() {
  return useQuery<{ id: number; alias: string; firstName: string; lastName: string }[]>({
    queryKey: ['all-users'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      
      //console.log('🚀 useAllUsers: EJECUTÁNDOSE - token existe:', !!token);
      
      try {
        //console.log('🔍 Obteniendo lista completa de usuarios desde /api/users...');
        
        const res = await fetch('/api/users?limit=50&offset=0', {
          credentials: 'include',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        
        //console.log('🔍 Respuesta del endpoint /api/users:', res.status, res.statusText);
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        //console.log('🔍 Datos RAW recibidos del backend:', data);
        
        // Manejar la nueva estructura de respuesta del backend
        let users: any[] = [];
        
        if (data.users && Array.isArray(data.users)) {
          // Nueva estructura con metadatos
          users = data.users;
        } else if (Array.isArray(data)) {
          // Estructura simple (fallback)
          users = data;
        } else {
          console.warn('⚠️ Estructura de respuesta inesperada:', data);
          users = [];
        }
        
        return users;
        
      } catch (error) {
        console.error('❌ Error obteniendo usuarios:', error);
        
        // Fallback: si el nuevo endpoint no está disponible, usar búsqueda
        console.log('� Intentando fallback con búsqueda por términos...');
        return await getFallbackUsers(token);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    retry: 1, // Solo reintentar una vez
  });
}

// Función de fallback si el endpoint principal no está disponible
async function getFallbackUsers(token: string | null) {
  const commonTerms = ['a', 'e', 'i', 'o', 'u', 'user', 'admin', 'test'];
  const allUsers = new Map();

  for (const term of commonTerms) {
    try {
      const res = await fetch(`/api/users/search?q=${term}`, {
        credentials: 'include',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (res.ok) {
        const users = await res.json();
        users.forEach((user: any) => {
          allUsers.set(user.id, user);
        });
      }
    } catch (error) {
      console.warn(`⚠️ Error en fallback con término "${term}":`, error);
    }
  }

  const finalUsers = Array.from(allUsers.values());
  //console.log('✅ Fallback completado. Usuarios únicos encontrados:', finalUsers.length);
  return finalUsers;
}

// ✅ Obtener usuarios que tienen acceso a un tablero específico
export function useBoardSharedUsers(boardId: string) {
  return useQuery<{ id: number; alias: string; firstName: string; lastName: string; permissionId?: number; level?: string }[]>({
    queryKey: ['board-shared-users', boardId],
    queryFn: async () => {
      if (!boardId) return [];
      
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/boards/${boardId}/permissions`, {
        credentials: 'include',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          // Endpoint no implementado aún, retornar lista vacía
          console.log('ℹ️ Endpoint de usuarios compartidos no implementado aún');
          return [];
        }
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      console.log('📥 Datos RAW recibidos del backend (usuarios compartidos):', data);
      
      // Logging detallado de la estructura
      if (Array.isArray(data) && data.length > 0) {
        console.log('🔍 Primer elemento de data:', data[0]);
        console.log('🔍 Estructura de user:', data[0].user);
        console.log('🔍 Claves disponibles en permission:', Object.keys(data[0]));
        if (data[0].user) {
          console.log('🔍 Claves disponibles en user:', Object.keys(data[0].user));
        }
      }
      
      // El endpoint de permisos devuelve objetos con información del usuario y permisos
      // Extraer solo la información del usuario
      if (Array.isArray(data)) {
        return data.map(permission => {
          const level = permission.level || permission.permissionLevel;
          
          console.log('🔍 Permission original del backend:', permission);
          console.log('🔧 Level antes del mapeo:', level);
          
          // Extraer información del usuario desde diferentes ubicaciones posibles
          const userInfo = permission.user || permission;
          
          const mappedUser = {
            id: userInfo.id || permission.userId,
            alias: userInfo.alias || userInfo.userName || userInfo.name || '',
            firstName: userInfo.firstName || userInfo.first_name || '',
            lastName: userInfo.lastName || userInfo.last_name || '',
            permissionId: permission.id, // Guardar el ID del permiso para poder eliminarlo
            level: level || 'VIEWER' // Mantener el nivel original del backend
          };
          
          console.log('✅ Usuario mapeado final:', mappedUser);
          console.log('🔍 Alias del usuario:', mappedUser.alias);
          console.log('🔍 userInfo:', userInfo);
          
          // Validación adicional: Si no hay alias, usar firstName + lastName
          if (!mappedUser.alias && (mappedUser.firstName || mappedUser.lastName)) {
            mappedUser.alias = `${mappedUser.firstName} ${mappedUser.lastName}`.trim();
            console.log('🔄 Alias generado a partir del nombre:', mappedUser.alias);
          }
          
          return mappedUser;
        });
      }
      
      return data.permissions || data.users || [];
    },
    enabled: !!boardId,
    staleTime: 2 * 60 * 1000, // 2 minutos de cache
  });
}

// ✅ Actualizar permisos de un usuario en un tablero específico
export function useUpdateBoardPermission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ boardId, userId, newLevel }: {
      boardId: string;
      userId: number;
      newLevel: 'OWNER' | 'EDITOR' | 'VIEWER';
    }) => {
      const token = localStorage.getItem('token');
      
      console.log('🔄 Actualizando permiso:', { boardId, userId, newLevel });
      
      const response = await fetch(`/api/boards/${boardId}/permissions/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify({ newLevel })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Permiso actualizado exitosamente:', result);
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidar las queries relacionadas para que se actualicen
      queryClient.invalidateQueries({ queryKey: ['board-shared-users', variables.boardId] });
    },
  });
}