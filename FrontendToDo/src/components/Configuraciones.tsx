import { useConfiguraciones, useActualizarConfiguraciones } from '../hooks/useConfiguraciones';
import { useClientStore } from '../store/clientStore';

export default function Configuraciones() {
  const { data: configData, isLoading } = useConfiguraciones();
  const actualizarMutation = useActualizarConfiguraciones();
  const { mostrarToast } = useClientStore();

  const configuraciones = configData?.configuraciones;
  const intervaloRefetch = configuraciones?.intervaloRefetch ?? 10;
  const descripcionMayusculas = configuraciones?.descripcionMayusculas ?? false;
  const tareasPorPagina = configuraciones?.tareasPorPagina ?? 5;

  const handleIntervaloSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const nuevoIntervalo = Number(formData.get('intervalo'));
    const nuevoTareasPorPagina = Number(formData.get('tareasPorPagina'));

    if (nuevoIntervalo < 1) {
      mostrarToast('El intervalo debe ser mayor a 0 segundos', 'error');
      return;
    }
    if (nuevoTareasPorPagina < 1) {
      mostrarToast('Las tareas por página deben ser mayor a 0', 'error');
      return;
    }

    actualizarMutation.mutate(
      { intervaloRefetch: nuevoIntervalo, tareasPorPagina: nuevoTareasPorPagina },
      {
        onSuccess: () => mostrarToast('Configuración actualizada', 'exito'),
        onError: (error) => mostrarToast(error.message || 'Error al actualizar', 'error'),
      }
    );
  };

  const handleToggleMayusculas = () => {
    const nuevoValor = !descripcionMayusculas;
    
    actualizarMutation.mutate({ descripcionMayusculas: nuevoValor }, {
      onSuccess: () => mostrarToast(
        `Descripción en mayúsculas ${nuevoValor ? 'activada' : 'desactivada'}`, 
        'exito'
      ),
      onError: (error) => mostrarToast(error.message || 'Error al actualizar', 'error'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-lg">Cargando configuraciones</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
      <div className="bg-pink-400 p-6 rounded-lg shadow-md w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">Configuración General</h3>
        <form onSubmit={handleIntervaloSubmit} className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <input
              name="intervalo"
              type="number"
              defaultValue={intervaloRefetch}
              min="1"
              max="300"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              disabled={actualizarMutation.isPending}
            />
            <span className="text-black-600">segundos (refetch)</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              name="tareasPorPagina"
              type="number"
              defaultValue={tareasPorPagina}
              min="1"
              max="100"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              disabled={actualizarMutation.isPending}
            />
            <span className="text-black-600">tareas por página</span>
          </div>
          <button
            type="submit"
            disabled={actualizarMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {actualizarMutation.isPending ? 'Actualizando...' : 'Actualizar Configuración'}
          </button>
        </form>
      </div>

      <div className="bg-pink-400 p-6 rounded-lg shadow-md w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">Formato de Descripción</h3>
        <div className="flex items-center justify-center space-x-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={descripcionMayusculas}
              onChange={handleToggleMayusculas}
              disabled={actualizarMutation.isPending}
              className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-black-700 font-medium">Mostrar en mayúsculas</span>
          </label>
        </div>
      </div>
    </div>
  );
}