import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useUserSettings, useUpdateSettings } from '../hooks/useSettings';
import LoadingSpinner from '../components/LoadingSpinner';

const Settings = () => {
  const { data: settings = {}, isLoading, error } = useUserSettings();
  const updateSettingsMutation = useUpdateSettings();
  const [localSettings, setLocalSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : Number(value);
    
    const updatedSettings = { ...localSettings, [name]: newValue };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    if (hasChanges) {
      updateSettingsMutation.mutate(localSettings);
      setHasChanges(false);
    }
  };

  useEffect(() => {
    if (hasChanges) {
      const timeoutId = setTimeout(() => {
        handleSaveChanges();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [localSettings, hasChanges]);

  if (isLoading) {
    return (
      <PageLayout title="Ajustes">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Ajustes">
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg">
          Error al cargar los ajustes: {error.message}
        </div>
      </PageLayout>
    );
  }

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
              name="uppercase_tasks"
              checked={localSettings.uppercase_tasks || false}
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
              name="refetch_interval"
              value={localSettings.refetch_interval || 30}
              onChange={handleSettingChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/20"
            />
            <span className="font-bold w-16 text-center text-lg p-2 rounded-md text-white bg-black/20">
              {localSettings.refetch_interval || 30}s
            </span>
          </div>
          <p className="text-sm mt-2 text-white/60">
            Las tareas y tableros se actualizarán automáticamente cada {localSettings.refetch_interval || 30} segundos.
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
              name="items_per_page"
              value={localSettings.items_per_page || 10}
              onChange={handleSettingChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/20"
            />
            <span className="font-bold w-16 text-center text-lg p-2 rounded-md text-white bg-black/20">
              {localSettings.items_per_page || 10}
            </span>
          </div>
          <p className="text-sm mt-2 text-white/60">
            Mostrar {localSettings.items_per_page || 10} tareas por página.
          </p>
        </div>

        {/* Indicador de cambios pendientes */}
        {hasChanges && (
          <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-200 text-sm text-center">
              Guardando cambios...
            </p>
          </div>
        )}

      </div>
    </PageLayout>
  );
};

export default Settings; 