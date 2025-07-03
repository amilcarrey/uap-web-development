import { useState } from 'react';
import { useSearchTasks } from '../../hooks/task';
import { TaskSearchResult } from './TaskSearchResult';

interface Props {
  tabId: string;
  onHideMainList?: (hide: boolean) => void; // Función para ocultar/mostrar la lista principal
}

export function TaskSearch({ tabId, onHideMainList }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  // Hook para búsqueda de tareas (sin filtro - usar 'all' por defecto)
  const { data: searchResults = [], isLoading, error } = useSearchTasks(tabId, searchTerm, 'all');

  // Determinar si mostrar resultados
  const showResults = searchTerm.length >= 2;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Notificar al componente padre si debe ocultar la lista principal
    if (onHideMainList) {
      onHideMainList(term.length >= 2);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    // Mostrar la lista principal nuevamente
    if (onHideMainList) {
      onHideMainList(false);
    }
  };

  return (
    <div className="task-search mb-6">
      {/* Barra de búsqueda mejorada */}
      <div className="relative mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Buscar tareas por contenido..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1"
              title="Limpiar búsqueda"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Indicador de ayuda */}
        {searchTerm.length > 0 && searchTerm.length < 2 && (
          <p className="text-sm text-gray-500 mt-2 px-1">
            💡 Escribe al menos 2 caracteres para buscar
          </p>
        )}
      </div>

      {/* Overlay de resultados de búsqueda */}
      {showResults && (
        <div className="search-overlay bg-white border border-gray-200 rounded-lg shadow-lg p-4 relative z-10">
          {/* Header de resultados */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔍</span>
              <h4 className="text-lg font-semibold text-gray-800">
                Resultados de búsqueda
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {isLoading ? 'Buscando...' : `${searchResults.length} resultado(s)`}
              </span>
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1"
                title="Cerrar búsqueda"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Estado de carga */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Buscando tareas...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-red-500">❌</span>
                <p className="text-red-700">Error al buscar tareas: {error.message}</p>
              </div>
            </div>
          )}

          {/* Sin resultados */}
          {!isLoading && !error && searchResults.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-lg font-medium">No se encontraron tareas</p>
              <p className="text-sm mt-1">que coincidan con "<strong>{searchTerm}</strong>"</p>
              <p className="text-xs mt-2 text-gray-400">Intenta con otros términos de búsqueda</p>
            </div>
          )}

          {/* Resultados */}
          {!isLoading && !error && searchResults.length > 0 && (
            <div className="search-results-list">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((task) => (
                  <TaskSearchResult 
                    key={task.id} 
                    task={task} 
                    searchTerm={searchTerm}
                    tabId={tabId}
                  />
                ))}
              </div>
              
              {/* Información adicional */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  ✨ Puedes editar, completar o eliminar tareas directamente desde aquí
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}