import React from 'react';
import PageLayout from '../components/PageLayout';
import useAppStore from '../stores/appStore';

const Settings = () => {
  const { settings, updateSettings } = useAppStore();

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : Number(value);
    updateSettings({ [name]: newValue });
  };

  return (
    <PageLayout title="Ajustes">
      <div className="space-y-8">

        {/* Forzar mayúsculas en tareas */}
        <div className="p-4 rounded-lg flex items-center justify-between bg-white/10">
          <h3 className="text-lg font-semibold text-white">
            Mostrar tareas en mayúsculas
          </h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="uppercaseTasks"
              checked={settings.uppercaseTasks || false}
              onChange={handleSettingChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Intervalo de actualización */}
        <div className="p-4 rounded-lg bg-white/10">
          <label htmlFor="refetchInterval" className="text-lg font-semibold mb-2 block text-white">
            Intervalo de actualización
          </label>
          <div className="flex items-center gap-4">
            <input
              id="refetchInterval"
              type="range"
              min="5"
              max="120"
              step="5"
              name="refetchInterval"
              value={settings.refetchInterval}
              onChange={handleSettingChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/20"
            />
            <span className="font-bold w-16 text-center text-lg p-2 rounded-md text-white bg-black/20">
              {settings.refetchInterval}s
            </span>
          </div>
          <p className="text-sm mt-2 text-white/60">
            Las tareas y tableros se actualizarán automáticamente cada {settings.refetchInterval} segundos.
          </p>
        </div>

        {/* Tareas por página */}
        <div className="p-4 rounded-lg bg-white/10">
          <label htmlFor="itemsPerPage" className="text-lg font-semibold mb-2 block text-white">
            Tareas por página
          </label>
          <div className="flex items-center gap-4">
            <input
              id="itemsPerPage"
              type="range"
              min="3"
              max="20"
              step="1"
              name="itemsPerPage"
              value={settings.itemsPerPage}
              onChange={handleSettingChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/20"
            />
            <span className="font-bold w-16 text-center text-lg p-2 rounded-md text-white bg-black/20">
              {settings.itemsPerPage}
            </span>
          </div>
          <p className="text-sm mt-2 text-white/60">
            Mostrar {settings.itemsPerPage} tareas por página.
          </p>
        </div>

      </div>
    </PageLayout>
  );
};

export default Settings; 