import React from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import useToast from '../../hooks/useToast';

export const SettingsForm = ({ onClose }) => {
  const { refetchInterval, showUppercase, setRefetchInterval, setShowUppercase } = useSettingsStore();
  const { showSuccess } = useToast();

  const handleIntervalChange = (e) => {
    const value = Math.max(1, Math.min(60, parseInt(e.target.value) || 10));
    setRefetchInterval(value);
    showSuccess('Intervalo de actualización actualizado');
  };

  const handleUppercaseChange = (e) => {
    setShowUppercase(e.target.checked);
    showSuccess(`Descripciones ${e.target.checked ? 'en mayúsculas' : 'en formato normal'}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Configuraciones</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Intervalo de Actualización (segundos)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max="60"
              value={refetchInterval}
              onChange={handleIntervalChange}
              className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">(1-60 segundos)</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showUppercase}
              onChange={handleUppercaseChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <span className="text-sm font-medium text-gray-700">
            Mostrar descripciones en mayúsculas
          </span>
        </div>
      </div>
    </div>
  );
}; 