import { useConfigStore } from "../stores/configStore";
import { useAuthStore } from "../stores/authStore";

// Componente para cambiar ajustes personales del usuario
export function Configuracion() {
  const { refetchInterval, setRefetchInterval, upperCaseDescription, setUpperCaseDescription } = useConfigStore();
  const user = useAuthStore(state => state.user);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Opciones de usuario</h2>
        {user && (
          <div className="mt-2 inline-flex items-center space-x-2 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <span>👤</span>
            <span>Usuario: <strong>{user.alias}</strong> (ID: {user.id})</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              🔄 Tiempo entre actualizaciones
            </span>
            <input
              type="number"
              min="1000"
              step="1000"
              value={refetchInterval}
              onChange={(e) => setRefetchInterval(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 space-y-1">
              <span className="text-xs text-gray-500 block">
                Milisegundos entre cada actualización automática
              </span>
              <span className="text-xs text-blue-600 block">
                Valor por defecto: 10000 ms (10 segundos)
              </span>
            </div>
          </label>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={upperCaseDescription}
              onChange={e => setUpperCaseDescription(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">
                🔤 Mostrar tareas en mayúsculas
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Convierte todas las descripciones a mayúsculas
              </p>
            </div>
          </label>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div>
              <h4 className="text-sm font-medium text-green-900">Ajustes por usuario</h4>
              <p className="text-xs text-green-700 mt-1">
                Cada cuenta tiene su propia configuración. Lo que cambies acá no afecta a otros. Otras opciones están en "Preferencias".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
