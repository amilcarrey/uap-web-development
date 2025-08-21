import type { UserRole } from '../types/permissions';

export function canEditBoard(userRole: UserRole): boolean {
  return ['owner', 'editor', 'OWNER', 'EDITOR'].includes(userRole);
}

export function canDeleteBoard(userRole: UserRole): boolean {
  return userRole === 'owner' || userRole === 'OWNER';
}

export function canShareBoard(userRole: UserRole): boolean {
  return userRole === 'owner' || userRole === 'OWNER';
}

export function canCreateTasks(userRole: UserRole): boolean {
  return ['owner', 'editor', 'OWNER', 'EDITOR'].includes(userRole);
}

export function canEditTasks(userRole: UserRole): boolean {
  return ['owner', 'editor', 'OWNER', 'EDITOR'].includes(userRole);
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<string, string> = {
    owner: 'Propietario',
    editor: 'Editor',
    reader: 'Solo lectura',
    viewer: 'Solo lectura',
    OWNER: 'Propietario',
    EDITOR: 'Editor',
    VIEWER: 'Solo lectura'
  };
  return roleNames[role] || role;
}

// Devuelve colores para cada tipo de usuario (rol) en etiquetas
export function getRoleColor(role: UserRole): string {
  const roleColors: Record<string, string> = {
    owner: 'bg-pink-100 text-pink-700',   // dueño
    editor: 'bg-green-100 text-green-700', // puede editar
    reader: 'bg-gray-50 text-gray-600',    // solo lectura (extra opcional)
    viewer: 'bg-gray-50 text-gray-600',    // también solo lectura
    OWNER: 'bg-pink-100 text-pink-700',
    EDITOR: 'bg-green-100 text-green-700',
    VIEWER: 'bg-gray-50 text-gray-600'
  };

  // Si el rol no está en la lista, usa gris por defecto
  return roleColors[role] || 'bg-gray-200 text-gray-700';
}
