import { toast } from 'react-hot-toast';
import { useUserSettings, useUpdateUserSettings } from '../hooks/userSettings';

export function UserSettings() {
  const { data: settings, isLoading } = useUserSettings();
  const updateSettings = useUpdateUserSettings();

  const handleUpdateSetting = async (key: string, value: any) => {
    try {
      await updateSettings.mutateAsync({ [key]: value });
      toast.success('Configuración actualizada');
    } catch (error) {
      toast.error('Error al actualizar configuración');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">Cargando configuraciones...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Configuraciones de Usuario</h2>
        
        <div className="space-y-6">
          {/* Elementos por página */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Elementos por página
            </label>
            <select
              value={settings?.itemsPerPage || 10}
              onChange={(e) => handleUpdateSetting('itemsPerPage', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 elementos</option>
              <option value={10}>10 elementos</option>
              <option value={15}>15 elementos</option>
              <option value={20}>20 elementos</option>
            </select>
          </div>

          {/* Intervalo de actualización */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intervalo de actualización (segundos)
            </label>
            <input
              type="number"
              min="10"
              step="10"
              value={(settings?.updateInterval || 60000) / 1000}
              onChange={(e) => handleUpdateSetting('updateInterval', Number(e.target.value) * 1000)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Alias en mayúsculas */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings?.upperCaseAlias || false}
                onChange={(e) => handleUpdateSetting('upperCaseAlias', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Mostrar alias en mayúsculas
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}