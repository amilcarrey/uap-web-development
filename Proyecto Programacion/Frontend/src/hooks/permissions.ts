// src/hooks/permissions.ts - VERSIÓN SIMPLIFICADA PARA BACKEND ACTUAL
import { getUserFromToken } from '../utils/auth';
import { useSearchUsers } from './userSettings';

// NOTA: Las siguientes funciones están comentadas porque requieren endpoints
// no implementados en el backend actual (/api/boards/permissions, etc.)

/*
// Obtener permisos de un tablero - REQUIERE /api/boards/:id/permissions
export function useBoardPermissions(boardId: string) {
  return useQuery<BoardPermission[]>({
    queryKey: ['board-permissions', boardId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/api/boards/${boardId}/permissions`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al obtener permisos del tablero');
      return res.json();
    },
    enabled: !!boardId,
  });
}
*/

// ✅ FUNCIÓN SIMPLIFICADA: Calcular el rol del usuario basado en datos disponibles
export function getUserRoleInBoard(boardOwnerId: number): 'owner' | 'editor' {
  const currentUser = getUserFromToken();
  if (!currentUser) return 'editor';
  
  return currentUser.id === boardOwnerId ? 'owner' : 'editor';
}

// ✅ FUNCIÓN SIMPLIFICADA: Verificar si el usuario puede editar un tablero
export function canUserEditBoard(boardOwnerId: number): boolean {
  return getUserRoleInBoard(boardOwnerId) === 'owner';
}

// ✅ FUNCIÓN SIMPLIFICADA: Verificar si el usuario es propietario de un tablero
export function isUserBoardOwner(boardOwnerId: number): boolean {
  const currentUser = getUserFromToken();
  return currentUser ? currentUser.id === boardOwnerId : false;
}

// ✅ Re-exportar la función de búsqueda de usuarios (ahora implementada en userSettings.ts)
export { useSearchUsers };