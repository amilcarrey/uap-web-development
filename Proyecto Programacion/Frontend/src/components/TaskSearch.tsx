import { useState } from 'react';
import { useSearchTasks } from '../hooks/task';
import type { TaskFilter } from '../types/task';
import { TaskItem } from './TaskItem';

interface Props {
  tabId: string;
}

export function TaskSearch({ tabId }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState<TaskFilter>('all');

  // Hook para búsqueda de tareas
  const { data: searchResults = [], isLoading, error } = useSearchTasks(tabId, searchTerm, searchFilter);

  // Determinar si mostrar resultados
  const showResults = searchTerm.length >= 2;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="task-search mb-6">
      {/* Barra de búsqueda */}
      <div className="relative mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar tareas por contenido..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Limpiar búsqueda"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filtro de búsqueda */}
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value as TaskFilter)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            <option value="active">Pendientes</option>
            <option value="completed">Completadas</option>
          </select>
        </div>

        {/* Indicador de ayuda */}
        {searchTerm.length > 0 && searchTerm.length < 2 && (
          <p className="text-sm text-gray-500 mt-1">
            Escribe al menos 2 caracteres para buscar
          </p>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {showResults && (
        <div className="search-results">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-700">
              Resultados de búsqueda
            </h4>
            <span className="text-sm text-gray-500">
              {isLoading ? 'Buscando...' : `${searchResults.length} resultado(s)`}
            </span>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Buscando tareas...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">Error al buscar tareas: {error.message}</p>
            </div>
          )}

          {!isLoading && !error && searchResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1.306m8 0V12a2 2 0 01-2 2H9a2 2 0 01-2-2V6.306" />
              </svg>
              <p>No se encontraron tareas que coincidan con "{searchTerm}"</p>
              <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
            </div>
          )}

          {!isLoading && !error && searchResults.length > 0 && (
            <div className="space-y-2">
              <ul className="space-y-1">
                {searchResults.map((task) => (
                  <TaskItem key={task.id} task={task} tabId={tabId} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}