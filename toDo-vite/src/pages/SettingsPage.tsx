// src/pages/SettingsPage.tsx
import { useSettingsStore } from '../stores/useSettingsStore';
import { useRouter } from "@tanstack/react-router";

export default function SettingsPage() {
  const {
    refetchInterval,
    uppercaseDescriptions,
    setRefetchInterval,
    toggleUppercaseDescriptions,
  } = useSettingsStore();
   const router = useRouter();

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-gray-800 text-white rounded-2xl shadow-md">
        <div className="p-6 text-white">
      <button
        onClick={() => router.history.go(-1)} // o usa navigate(-1) si querés ir una página atrás en el historial
        className="mb-4 text-blue-400 hover:text-blue-600 transition"
      >
        ← Volver
      </button>
      </div>
      <h2 className="text-2xl font-bold mb-6">Configuraciones</h2>

      <div className="mb-4">
        <label className="block mb-2">Intervalo de actualización (s):</label>
        <input
          type="text"
          value={refetchInterval}
          onChange={(e) => setRefetchInterval(Number(e.target.value))}
          className="w-full border-2 px-3 py-2 rounded text-white"
        />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={uppercaseDescriptions}
          onChange={toggleUppercaseDescriptions}
        />
        <label>Mostrar tareas en mayúsculas</label>
      </div>
    </div>
  );
}
