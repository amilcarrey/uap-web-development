import { useSettings } from '../context/SettingsContext';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

function Settings() {
  const {
    refetchInterval,
    setRefetchInterval,
    uppercaseDescriptions,
    setUppercaseDescriptions,
  } = useSettings();

  // Convertir ms a segundos para mostrar
  const [seconds, setSeconds] = useState(refetchInterval / 1000);

  // Opciones predefinidas para el intervalo (en segundos)
  const intervalOptions = [5, 10, 30, 60];

  const handleIntervalChange = (newSeconds: number) => {
    setSeconds(newSeconds);
    setRefetchInterval(newSeconds * 1000); // Guarda en milisegundos
    toast.success(`Intervalo actualizado a ${newSeconds}s`);
  };

  const handleUppercaseToggle = () => {
    setUppercaseDescriptions(!uppercaseDescriptions);
    toast.success(
      uppercaseDescriptions
        ? 'Texto en minúsculas'
        : 'Texto en MAYÚSCULAS'
    );
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Configuraciones</h1>

      {/* Sección: Intervalo de Refetch */}
      <section className="space-y-4">
        <h2 className="font-bold border-b pb-2">Actualización automática</h2>
        <p className="text-gray-600">
          Actualizar tareas cada: <strong>{seconds} segundos</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          {intervalOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleIntervalChange(option)}
              className={`px-4 py-2 rounded ${
                seconds === option
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {option}s
            </button>
          ))}
        </div>
      </section>

      {/* Sección: Mayúsculas */}
      <section className="space-y-4">
        <h2 className="font-bold border-b pb-2">Formato de texto</h2>
        <button
          onClick={handleUppercaseToggle}
          className={`px-4 py-2 rounded ${
            uppercaseDescriptions
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {uppercaseDescriptions
            ? 'Desactivar MAYÚSCULAS'
            : 'Activar MAYÚSCULAS'}
        </button>
      </section>
    </div>
  );
}

export default Settings;