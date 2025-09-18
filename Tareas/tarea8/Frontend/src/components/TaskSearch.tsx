import { useState } from 'react';
import { useSearchTasks } from '../hooks/task';
import { TaskSearchResult } from './TaskSearchResult';

interface Props {
  tabId: string;
  onHideMainList?: (hide: boolean) => void;
}

export function TaskSearch({ tabId, onHideMainList }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: searchResults = [], isLoading, error } = useSearchTasks(tabId, searchTerm, 'all');
  const showResults = searchTerm.length >= 2;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (onHideMainList) onHideMainList(term.length >= 2);
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (onHideMainList) onHideMainList(false);
  };

  return (
    <div className="task-search mb-6">
      {/* 🔎 Search bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="🔍 Buscar tareas por contenido..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white text-indigo-900"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full p-1"
            title="Limpiar búsqueda"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {searchTerm.length > 0 && searchTerm.length < 2 && (
        <p className="text-sm text-indigo-500 mt-2 px-1">
          💡 Escribe al menos 2 caracteres para buscar
        </p>
      )}

      {showResults && (
        <div className="bg-white border border-indigo-200 rounded-xl shadow-lg p-4 relative z-10">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔍</span>
              <h4 className="text-lg font-semibold text-indigo-800">Resultados de búsqueda</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-indigo-500">
                {isLoading ? 'Buscando...' : `${searchResults.length} resultado(s)`}
              </span>
              <button
                onClick={clearSearch}
                className="text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full p-1"
                title="Cerrar búsqueda"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <span className="ml-3 text-indigo-600">Buscando tareas...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-red-500">❌</span>
                <p className="text-red-700">Error al buscar tareas: {error.message}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && searchResults.length === 0 && (
            <div className="text-center py-12 text-indigo-400">
              <div className="mb-4 text-4xl">🔍</div>
              <p className="text-lg font-medium">No se encontraron tareas</p>
              <p className="text-sm mt-1">que coincidan con "<strong>{searchTerm}</strong>"</p>
              <p className="text-xs mt-2 text-indigo-300">Intenta con otros términos de búsqueda</p>
            </div>
          )}

          {!isLoading && !error && searchResults.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((task) => (
                <TaskSearchResult
                  key={task.id}
                  task={task}
                  searchTerm={searchTerm}
                  tabId={tabId}
                />
              ))}
              <div className="mt-4 pt-3 border-t border-indigo-100 text-center">
                <p className="text-xs text-indigo-500">
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
