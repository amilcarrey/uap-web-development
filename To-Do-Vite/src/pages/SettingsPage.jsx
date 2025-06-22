import React from 'react';
import PageLayout from '../components/PageLayout';
import ThemeToggle from '../components/ThemeToggle';
import useAppStore from '../stores/appStore';

const SettingsPage = () => {
  const { settings, updateSettings } = useAppStore();

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    // Asegurarse de que el valor sea numérico si corresponde
    const newValue = e.target.type === 'range' || e.target.type === 'number' 
      ? Number(value) 
      : value;
    updateSettings({ [name]: newValue });
  };

  return (
    <PageLayout title="Ajustes">
      <div className="space-y-8">
        
        {/* Configuración de Tema */}
        <div className="p-4 rounded-lg flex items-center justify-between" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Tema de la aplicación
          </h3>
          <ThemeToggle />
        </div>

        {/* Intervalo de actualización */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <label htmlFor="refetchInterval" className="text-lg font-semibold mb-2 block" style={{ color: 'var(--text-primary)' }}>
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
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{backgroundColor: 'var(--bg-tertiary)'}}
            />
            <span className="font-bold w-16 text-center text-lg p-2 rounded-md" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)' }}>
              {settings.refetchInterval}s
            </span>
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Las tareas se actualizarán automáticamente cada {settings.refetchInterval} segundos.
          </p>
        </div>

        {/* Tareas por página */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <label htmlFor="itemsPerPage" className="text-lg font-semibold mb-2 block" style={{ color: 'var(--text-primary)' }}>
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
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{backgroundColor: 'var(--bg-tertiary)'}}
            />
            <span className="font-bold w-16 text-center text-lg p-2 rounded-md" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)' }}>
              {settings.itemsPerPage}
            </span>
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Mostrar {settings.itemsPerPage} tareas por página en los tableros.
          </p>
        </div>

      </div>
    </PageLayout>
  );
};

export default SettingsPage; 