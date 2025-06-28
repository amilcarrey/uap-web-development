// src/utils/permissions.ts - COMPLETAR
// src/utils/permissions.ts - COMPLETAR
import type { UserRole } from '../types/permissions';

export function canEditBoard(userRole: UserRole): boolean {
  return ['owner', 'editor'].includes(userRole);
}

export function canDeleteBoard(userRole: UserRole): boolean {
  return userRole === 'owner';
}

export function canShareBoard(userRole: UserRole): boolean {
  return userRole === 'owner';
}

// AGREGAR ESTAS FUNCIONES:
export function canCreateTasks(userRole: UserRole): boolean {
  return ['owner', 'editor'].includes(userRole);
}

export function canEditTasks(userRole: UserRole): boolean {
  return ['owner', 'editor'].includes(userRole);
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames = {
    owner: 'Propietario',
    editor: 'Editor',
    reader: 'Solo lectura'
  };
  return roleNames[role] || role;
}

export function getRoleColor(role: UserRole): string {
  const roleColors = {
    owner: 'bg-purple-100 text-purple-800',
    editor: 'bg-blue-100 text-blue-800',
    reader: 'bg-gray-100 text-gray-800'
  };
  return roleColors[role] || 'bg-gray-100 text-gray-800';
}