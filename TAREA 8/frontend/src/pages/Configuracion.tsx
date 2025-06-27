import React, { useState, useEffect } from 'react';
import { configuracionService } from '../services/configuracionService';
import NotificationContainer from '../components/NotificationContainer';
import { useNotifications } from '../hooks/useNotifications';

interface ConfiguracionSimple {
  intervaloActualizacion: number;
}

const Configuracion: React.FC = () => {
  const { notifications, removeNotification, showSuccess, showError } = useNotifications();
  const [configuracion, setConfiguracion] = useState<ConfiguracionSimple>({
    intervaloActualizacion: 30
  });
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const data = await configuracionService.obtenerConfiguracion();
      setConfiguracion({ intervaloActualizacion: data.intervaloActualizacion });
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Error al cargar configuración';
      showError('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      await configuracionService.actualizarConfiguracion(configuracion);
      showSuccess('Configuración guardada', 'Los cambios se han guardado exitosamente');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Error al guardar configuración';
      showError('Error', errorMsg);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>
              <p className="text-gray-600 mb-8">Personaliza el intervalo de actualización automática</p>

              <div className="space-y-8">
                {/* Intervalo de Actualización */}
                <div className="pb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Actualización Automática</h2>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intervalo de actualización (segundos)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="300"
                      step="5"
                      value={configuracion.intervaloActualizacion}
                      onChange={(e) => setConfiguracion({ intervaloActualizacion: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>5s</span>
                      <span className="font-medium">{configuracion.intervaloActualizacion}s</span>
                      <span>300s</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Frecuencia con la que se actualizan automáticamente los tableros y tareas
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={cargarConfiguracion}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Restablecer
                </button>
                <button
                  type="button"
                  onClick={handleGuardar}
                  disabled={guardando}
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </>
  );
};

export default Configuracion;
