import { useState } from 'react';
import { useTasksByCategory, useTaskMutations } from '../hooks/useTasks';
import { useClientStore } from '../stores/clientStore';
import TaskFilters from './TaskFilters';

export default function TaskList({ category, boardId, filter, setFilter }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const { data, isLoading, error } = useTasksByCategory({
    category,
    boardId,
    page,
    pageSize,
    filter,
    search,
  });

  const tasks = data?.tasks || [];
  const totalPages = data?.totalPages || 1;
  const { toggleTask, deleteTask, deleteCompletedTasks } = useTaskMutations(boardId);
  const { 
    modals, 
    openDeleteModal, 
    closeDeleteModal,
    openAddTaskModal,
    startEditing,
    settings
  } = useClientStore();

  // Filtrar tareas (activas/completadas/todas)
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter(t => !t.completed).length;

  const handleClearCompleted = () => setShowConfirm(true);

  const handleConfirmClear = () => {
    deleteCompletedTasks.mutate({ boardId, category }, {
      onSettled: () => setShowConfirm(false)
    });
  };

  if (isLoading) return (
    <div className="p-4 text-center text-gray-500">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-2">Loading tasks...</p>
    </div>
  );

  if (error) return (
    <div className="p-4 text-center text-red-500">
      ❌ Error: {error.message}
    </div>
  );

  const handleEditClick = (task) => {
    startEditing(task);
    openAddTaskModal();
  };

  return (
    <>
      <TaskFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        activeCount={activeCount}
        onClearCompleted={handleClearCompleted}
        isClearing={deleteCompletedTasks.isPending}
        search={search}
        setSearch={setSearch}
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        handleConfirmClear={handleConfirmClear}
      />
      <div className="space-y-4">
        {/* Lista de tareas paginadas */}
        <ul className="space-y-3">
          {filteredTasks.map(task => (
            <li 
              key={task.id}
              className={`flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all ${
                toggleTask.isPending ? 'opacity-50' : ''
              }`}
            >
              <label className="flex items-center flex-grow cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask.mutate({
                    id: task.id,
                    completed: !task.completed,
                    category,
                    boardId
                  })}
                  disabled={toggleTask.isPending}
                  className="h-5 w-5 mr-3 rounded border-gray-300 text-blue-500 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className={`flex-grow ${
                  task.completed ? 'line-through text-gray-400' : 'text-gray-700'
                }`}>
                  {settings.uppercaseDescriptions
                    ? task.text.toUpperCase()
                    : task.text}
                </span>
              </label>

              {/* Botones de acción */}
              <div className="flex space-x-2 ml-2">
                <button
                  onClick={() => handleEditClick(task)}
                  disabled={toggleTask.isPending || deleteTask.isPending}
                  className="w-8 h-8 flex items-center justify-center bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                  title="Edit task"
                >
                  ✏️
                </button>
                <button
                  onClick={() => openDeleteModal(task)}
                  disabled={deleteTask.isPending}
                  className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Controles de paginación */}
        {tasks.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="mx-2">Página {page} de {totalPages}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div>
              <label className="mr-2">Tareas por página:</label>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setPage(1); // vuelve a la primera página al cambiar el tamaño
                }}
                className="border rounded px-2 py-1"
              >
                {[3, 5, 10, 20].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {modals.isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Delete Task</h3>
              <p>Are you sure you want to delete "{modals.taskToDelete?.text}"?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteTask.mutate(
                      { id: modals.taskToDelete.id, category },
                      {
                        onSuccess: () => {
                          closeDeleteModal();
                          if (filteredTasks.length === 1 && page > 1) {
                            setPage(page - 1);
                          }
                        },
                      }
                    );
                  }}
                  disabled={deleteTask.isPending}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  {deleteTask.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}