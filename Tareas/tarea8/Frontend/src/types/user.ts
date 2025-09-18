export interface UserProfile {
  id: string;
  alias: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  refetchInterval: number;
  upperCaseDescription: boolean;
  theme: 'light' | 'dark';
  taskPageSize: number;
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