import { useQueryClient } from '@tanstack/react-query';
import { useSettingsStore } from '../store/useSettingsStore';
import { toast } from 'react-hot-toast';

export const Settings = () => {
    const {
        refetchInterval,
        upperCaseDescription,
        paginationLimit,
        setRefetchInterval,
        setUpperCaseDescription,
        setPaginationLimit,
    } = useSettingsStore();

    const queryClient = useQueryClient();

    const handlePaginationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= 20) {
            setPaginationLimit(value);
            // Refetch para actualizar con nuevo límite
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Límite de paginación guardado');
        } else {
            toast.error('El límite debe estar entre 1 y 20');
        }
    };

    const handleRefetchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= 5000) {
            setRefetchInterval(value);
            // Refetch para aplicar nuevo intervalo
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Intervalo de actualización guardado');
        } else {
            toast.error('El intervalo mínimo es de 5 segundos');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Configuraciones</h2>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intervalo de Actualización (ms)
                    </label>
                    <input
                        type="number"
                        value={refetchInterval}
                        onChange={handleRefetchChange}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        min="5000"
                        step="1000"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Mínimo: 5000ms (5 segundos)
                    </p>
                </div>

                <div>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={upperCaseDescription}
                            onChange={(e) => setUpperCaseDescription(e.target.checked)}
                            className="rounded text-blue-600"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Mostrar descripciones en mayúsculas
                        </span>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Límite de Paginación
                    </label>
                    <input
                        type="number"
                        value={paginationLimit}
                        onChange={handlePaginationChange}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="20"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Entre 1 y 20 items por página
                    </p>
                </div>
            </div>
        </div>
    );
};