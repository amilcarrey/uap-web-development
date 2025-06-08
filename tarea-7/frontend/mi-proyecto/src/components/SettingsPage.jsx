
import React from 'react';
import { useGlobalConfig, useUpdateGlobalConfig } from '../hooks/useTasks';
import useNotificationStore from '../store/notificationStore';

const SettingsPage = () => {
    // Obtener la configuración actual
    const { data: config, isLoading, isError, error } = useGlobalConfig();
    // Hook para actualizar la configuración
    const updateConfigMutation = useUpdateGlobalConfig();
    // Para mostrar notificaciones
    const showNotification = useNotificationStore((state) => state.showNotification);

    // Manejador para el cambio del intervalo de refetch
    const handleRefetchIntervalChange = (e) => {
        const value = parseInt(e.target.value, 10);
        // Validar que el valor sea un número y no sea negativo
        if (!isNaN(value) && value >= 0) {
            updateConfigMutation.mutate(
                { refetch_interval: value },
                {
                    onSuccess: () => {
                        showNotification('Refetch interval updated!', 'success');
                    },
                    onError: (err) => {
                        showNotification(`Error updating refetch interval: ${err.message}`, 'error');
                    }
                }
            );
        } else {
            showNotification('Please enter a valid number for refetch interval (0 or greater).', 'error');
        }
    };

    // Manejador para el cambio del interruptor de mayúsculas
    const handleUppercaseDescriptionChange = (e) => {
        updateConfigMutation.mutate(
            { uppercase_description: e.target.checked },
            {
                onSuccess: () => {
                    showNotification('Uppercase description setting updated!', 'success');
                },
                onError: (err) => {
                    showNotification(`Error updating setting: ${err.message}`, 'error');
                }
            }
        );
    };

    if (isLoading) {
        return <p className="text-center text-gray-600 mt-10">Loading settings...</p>;
    }

    if (isError) {
        return <p className="text-center text-red-500 mt-10">Error loading settings: {error.message}</p>;
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Global Settings</h2>

            {/* Intervalo de Refetch */}
            <div className="mb-6">
                <label htmlFor="refetchInterval" className="block text-gray-700 text-sm font-bold mb-2">
                    Task Refetch Interval (milliseconds):
                </label>
                <input
                    type="number"
                    id="refetchInterval"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={config.refetch_interval || 0} // Asegura que no sea null/undefined
                    onChange={handleRefetchIntervalChange}
                    min="0" // No permitir valores negativos
                    placeholder="e.g., 10000 for 10 seconds"
                />
                <p className="text-gray-500 text-xs mt-1">
                    Set to 0 to disable automatic refetching.
                </p>
            </div>

            {/* Descripción en Mayúsculas */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-gray-700 text-sm font-bold">Show Task Descriptions in Uppercase:</span>
                <label htmlFor="uppercaseToggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            id="uppercaseToggle"
                            className="sr-only"
                            checked={config.uppercase_description}
                            onChange={handleUppercaseDescriptionChange}
                        />
                        <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                    </div>
                </label>
                {/* Estilos para el toggle switch (se pueden añadir en tu CSS global o aquí con Tailwind JIT si tienes) */}
                <style>{`
                    input:checked ~ .dot {
                        transform: translateX(100%);
                        background-color: #6366F1; /* Indigo 500 */
                    }
                    input:checked ~ .block {
                        background-color: #4338CA; /* Indigo 700 */
                    }
                `}</style>
            </div>
            <p className="text-sm text-gray-600 text-center">
                Settings are saved automatically.
            </p>
        </div>
    );
};

export default SettingsPage;