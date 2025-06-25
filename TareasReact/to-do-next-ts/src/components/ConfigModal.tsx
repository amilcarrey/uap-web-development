'use client';
import { X } from 'lucide-react';
import { useConfigStore } from '@/stores/configStore';

export default function ConfigModal({ onClose }: { onClose: () => void }) {
  const {
    refetchInterval,
    tareasPorPagina,
    mayusculas,
    setRefetchInterval,
    setTareasPorPagina,
    setMayusculas,
  } = useConfigStore();

  const guardarEnBackend = async () => {
    try {
      await fetch('http://localhost:4000/api/config', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refetchInterval,
          tareasPorPagina,
          mayusculas,
        }),
      });
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 border border-cyan-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-cyan-700 transition"
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-cyan-700 mb-2 flex items-center gap-2">
          Configuración
        </h2>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Intervalo de actualización (segundos)
          </label>
          <input
            type="number"
            min={1}
            value={refetchInterval / 1000}
            onChange={(e) => setRefetchInterval(Number(e.target.value) * 1000)}
            className="border border-cyan-200 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Tareas por página</label>
          <input
            type="number"
            min={1}
            value={tareasPorPagina}
            onChange={(e) => setTareasPorPagina(Number(e.target.value))}
            className="border border-cyan-200 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-700"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Descripción en mayúsculas</span>
          <input
            type="checkbox"
            checked={mayusculas}
            onChange={(e) => setMayusculas(e.target.checked)}
            className="accent-cyan-600 w-5 h-5"
          />
        </div>

        <button
          onClick={() => {
            guardarEnBackend().then(onClose);
          }}
          className="mt-2 bg-cyan-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-800 transition w-full shadow"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
