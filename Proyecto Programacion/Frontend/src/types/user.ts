export interface UserProfile {
  id: string;
  alias: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  refetchInterval: number; // Intervalo de actualización en milisegundos
  upperCaseDescription: boolean; // Mostrar descripciones en mayúsculas
  theme: 'light' | 'dark'; // Tema de la aplicación
  taskPageSize: number; // Tamaños de página para tareas
}

export interface UpdateUserSettingsRequest {
  refetchInterval?: number;
  upperCaseDescription?: boolean;
  theme?: 'light' | 'dark';
  taskPageSize?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}