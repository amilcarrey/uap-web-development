import { api } from '../lib/api';

// Define UserSettings types based on backend
export interface TaskVisualizationPrefs {
  viewMode?: 'list' | 'kanban'; // Example values
  showCompleted?: boolean;
  sortOrder?: string; // Example: 'dueDate', 'priority'
  // Add other preferences as defined in backend/frontend needs
}

export interface UserSettings {
  userId: number;
  autoUpdateInterval: number | null; // In seconds
  taskVisualizationPrefs: TaskVisualizationPrefs | null;
  createdAt?: string;
  updatedAt?: string;
}

interface UserSettingsResponse {
  status: string;
  data: {
    settings: UserSettings;
  };
}

// Get current user's settings
export const getUserSettings = async (): Promise<UserSettings> => {
  const response = await api.get<UserSettingsResponse>('/user/settings');
  return response.data.data.settings;
};

// Update current user's settings
// Payload can be partial
export type UpdateUserSettingsPayload = Partial<Omit<UserSettings, 'userId' | 'createdAt' | 'updatedAt'>>;

export const updateUserSettings = async (payload: UpdateUserSettingsPayload): Promise<UserSettings> => {
  const response = await api.put<UserSettingsResponse>('/user/settings', payload);
  return response.data.data.settings;
};
