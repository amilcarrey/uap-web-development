import { toast } from 'react-hot-toast';
import { useUserSettings, useUpdateUserSettings } from '../hooks/userSettings';

export function UserSettings() {
  const { data: settings, isLoading } = useUserSettings();
  const updateSettings = useUpdateUserSettings();

  const handleUpdateSetting = async (key: string, value: any) => {
    try {
      await updateSettings.mutateAsync({ [key]: value });
      toast.success('✅ Configuración actualizada');
    } catch (error) {
      toast.error('❌ Error al actualizar configuración');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center text-indigo-600 font-medium">🔄 Cargando configuraciones...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto">
      <div className="border-b border-indigo-300 pb-4">
        <h2 className="text-2xl font-bold text-indigo-800">⚙️ Preferencias de Usuario</h2>
        <p className="mt-1 text-sm text-indigo-600">
          Ajusta tu experiencia dentro de la aplicación según tus preferencias.
        </p>
      </div>

      <div className="space-y-6">
        {/* 🔢 Selector de elementos por página */}
        <div>
          <label className="block text-sm font-semibold text-indigo-700 mb-2">
            Elementos por página
          </label>
          <select
            value={settings?.itemsPerPage || 10}
            onChange={(e) => handleUpdateSetting('itemsPerPage', Number(e.target.value))}
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 text-indigo-800"
          >
            <option value={5}>5 elementos</option>
            <option value={10}>10 elementos</option>
            <option value={15}>15 elementos</option>
            <option value={20}>20 elementos</option>
          </select>
          <p className="mt-1 text-xs text-indigo-500">
            Define cuántas tareas se mostrarán por página en los tableros.
          </p>
        </div>

        {/* 🧭 Información adicional */}
        <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-indigo-600 text-xl">🧭</span>
            <div>
              <h4 className="text-sm font-semibold text-indigo-800">Configuraciones Adicionales</h4>
              <p className="text-xs text-indigo-700 mt-1">
                El intervalo de actualización y otras opciones están disponibles en la pestaña "Aplicación".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
