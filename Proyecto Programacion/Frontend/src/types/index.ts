// Exportar todos los tipos desde un solo archivo
export * from './permissions';
export * from './board';
export * from './task';
export * from './user';
export * from './api';

// Tipos adicionales útiles
export interface Tab {
  id: string;
  name: string;
  userRole?: 'owner' | 'editor' | 'reader';
}

// Para el store de autenticación
export interface AuthUser {
  id: string;
  alias: string;
  firstName: string;
  lastName: string;
}

// Para el estado de la UI
export interface UIState {
  editingTaskId: string | null;
  isShareModalOpen: boolean;
  activeTabId: string | null;
  taskFilter: 'all' | 'active' | 'completed';
}