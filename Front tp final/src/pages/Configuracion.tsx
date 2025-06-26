// src/pages/Configuracion.tsx
import { useUserConfig, useUpdateUserConfig } from "../hooks/useUserConfig";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Save } from "lucide-react";
import { useState, useEffect } from "react";

// Reemplazar por esto:
function Configuracion() {
  const { data: config, isLoading, error } = useUserConfig();
  const updateConfig = useUpdateUserConfig();
  
  // Estados locales con valores por defecto (nunca undefined)
  const [refetchInterval, setRefetchInterval] = useState(10000);
  const [uppercaseDescriptions, setUppercaseDescriptions] = useState(false);
  const [taskPageSize, setTaskPageSize] = useState(10);

  // Cargar datos cuando lleguen del servidor
  useEffect(() => {
    if (config) {
      setRefetchInterval(config.refetch_interval ?? 10000); // ← Usar ?? para evitar undefined
      setUppercaseDescriptions(config.uppercase_descriptions ?? false);
      setTaskPageSize(config.task_page_size ?? 10);
    }
  }, [config]);

  const handleSave = () => {
    updateConfig.mutate({
      //user_id: config?.user_id,
      refetch_interval: refetchInterval,
      uppercase_descriptions: uppercaseDescriptions,
      task_page_size: taskPageSize,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-pink-600">Cargando configuraciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error al cargar configuraciones: {error.message}</p>
          <p className="text-sm mt-2">Verifica que la ruta del backend sea correcta</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      {/* ENCABEZADO */}
      <header className="flex items-center justify-between px-6 py-4 bg-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-pink-600 hover:text-pink-800">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-pink-700">Configuraciones</h1>
        </div>
      </header>

      {/* PRINCIPAL */}
      <main className="flex-1 p-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6 border border-pink-200">
          
          {/* Intervalo de refetch */}
          <div className="mb-6">
            <label className="block text-pink-700 font-medium mb-2">
              Intervalo de actualización (milisegundos)
            </label>
            <input
              type="number"
              value={refetchInterval} // ← Ya no será undefined
              onChange={(e) => setRefetchInterval(Number(e.target.value) || 10000)}
              className="w-full border border-pink-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              min="1000"
              step="1000"
            />
          </div>

          {/* Mayúsculas */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercaseDescriptions} // ← Ya no será undefined
                onChange={(e) => setUppercaseDescriptions(e.target.checked)}
                className="accent-pink-500 w-5 h-5"
              />
              <span className="text-pink-700 font-medium">
                Mostrar descripciones en mayúsculas
              </span>
            </label>
          </div>

          {/* Tamaño de página */}
          <div className="mb-6">
            <label className="block text-pink-700 font-medium mb-2">
              Tareas por página
            </label>
            <select
              value={taskPageSize} // ← Ya no será undefined
              onChange={(e) => setTaskPageSize(Number(e.target.value) || 10)}
              className="w-full border border-pink-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value={5}>5 tareas</option>
              <option value={10}>10 tareas</option>
              <option value={20}>20 tareas</option>
              <option value={50}>50 tareas</option>
            </select>
          </div>

          {/* Botón guardar */}
          <button
            onClick={handleSave}
            disabled={updateConfig.isPending}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {updateConfig.isPending ? "Guardando..." : "Guardar cambios"}
          </button>

          {/* Mensajes de estado */}
          {updateConfig.isSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-xl text-center">
              ✅ Configuraciones guardadas correctamente
            </div>
          )}

          {updateConfig.isError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-xl text-center">
              ❌ Error al guardar: {updateConfig.error?.message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Configuracion;