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
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Preferencias de Usuario</h2>
        <p className="mt-1 text-sm text-gray-600">
          Personaliza tu experiencia con la aplicación
        </p>
      </div>
        
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
            <p className="mt-1 text-xs text-gray-500">
              Número de tareas que se muestran por página en los tableros
            </p>
          </div>

          {/* Nota informativa */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-lg">ℹ️</span>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Configuraciones Adicionales</h4>
                <p className="text-xs text-blue-700 mt-1">
                  El intervalo de actualización y otras configuraciones de la aplicación se encuentran en la pestaña "Aplicación".
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}