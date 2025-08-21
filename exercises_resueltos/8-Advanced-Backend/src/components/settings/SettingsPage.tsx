import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as userService from '../../services/userService';
import { type UserSettings, type UpdateUserSettingsPayload, type TaskVisualizationPrefs } from '../../services/userService';
import { toastSuccess, toastError } from '../../lib/toast';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const { data: settings, isLoading: isLoadingSettings, isError, error } = useQuery<UserSettings, Error>({
    queryKey: ['userSettings', currentUser?.id],
    queryFn: userService.getUserSettings,
    enabled: !!currentUser?.id, // Only fetch if user is loaded
  });

  const updateSettingsMutation = useMutation<UserSettings, Error, UpdateUserSettingsPayload>({
    mutationFn: userService.updateUserSettings,
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['userSettings', currentUser?.id], updatedSettings); // Update cache
      toastSuccess('Settings updated successfully!');
    },
    onError: (err) => {
      toastError(err.message || 'Failed to update settings.');
    },
  });

  // Form state
  const [autoUpdateInterval, setAutoUpdateInterval] = useState<string>(''); // Store as string for input field
  const [taskVisPrefs, setTaskVisPrefs] = useState<TaskVisualizationPrefs>({});

  useEffect(() => {
    if (settings) {
      setAutoUpdateInterval(settings.autoUpdateInterval?.toString() ?? '300'); // Default to 300s if null
      setTaskVisPrefs(settings.taskVisualizationPrefs ?? {});
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const interval = parseInt(autoUpdateInterval, 10);
    if (isNaN(interval) || interval < 0) {
      toastError('Auto-update interval must be a valid non-negative number.');
      return;
    }
    const payload: UpdateUserSettingsPayload = {
      autoUpdateInterval: interval,
      taskVisualizationPrefs: taskVisPrefs,
    };
    updateSettingsMutation.mutate(payload);
  };

  const handleVisPrefChange = (key: keyof TaskVisualizationPrefs, value: any) => {
    setTaskVisPrefs(prev => ({ ...prev, [key]: value }));
  };

  if (isLoadingSettings) return <div className="p-6 text-center">Loading settings...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Error loading settings: {error?.message}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 hover:underline">
        &larr; Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">User Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="autoUpdateInterval" className="block text-sm font-medium text-gray-700">
            Auto-Update Interval (seconds)
          </label>
          <input
            type="number"
            id="autoUpdateInterval"
            value={autoUpdateInterval}
            onChange={(e) => setAutoUpdateInterval(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min="0"
            placeholder="e.g., 300 for 5 minutes"
          />
          <p className="mt-1 text-xs text-gray-500">Set to 0 to disable auto-updates.</p>
        </div>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-medium text-gray-900 px-2">Task Visualization Preferences</legend>
          <div className="space-y-4 mt-2">
            <div>
              <label htmlFor="viewMode" className="block text-sm font-medium text-gray-700">View Mode</label>
              <select
                id="viewMode"
                value={taskVisPrefs.viewMode || 'list'}
                onChange={(e) => handleVisPrefChange('viewMode', e.target.value as 'list' | 'kanban')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="list">List View</option>
                <option value="kanban">Kanban View (if implemented)</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                id="showCompleted"
                type="checkbox"
                checked={taskVisPrefs.showCompleted === undefined ? true : !!taskVisPrefs.showCompleted} // Default to true
                onChange={(e) => handleVisPrefChange('showCompleted', e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="showCompleted" className="ml-2 block text-sm text-gray-900">
                Show Completed Tasks
              </label>
            </div>
             <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">Default Sort Order</label>
              <select
                id="sortOrder"
                value={taskVisPrefs.sortOrder || 'createdAt'}
                onChange={(e) => handleVisPrefChange('sortOrder', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="createdAt">Creation Date</option>
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                {/* Add other sort options as needed */}
              </select>
            </div>
          </div>
        </fieldset>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={updateSettingsMutation.isPending}
          >
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
