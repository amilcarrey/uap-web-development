import { useTasksByCategory, useTaskMutations } from '../hooks/useTasks';
import { useClientStore } from '../stores/clientStore';
import { AnimatePresence, motion } from 'framer-motion';

export default function TaskList({ category, filter }) {
  const { data: tasks = [], isLoading, error } = useTasksByCategory(category);
  const { toggleTask, deleteTask } = useTaskMutations();
  const { modals, openDeleteModal, closeDeleteModal } = useClientStore();

  const filteredTasks = () => {
    switch(filter) {
      case 'active': return tasks.filter(task => !task.completed);
      case 'completed': return tasks.filter(task => task.completed);
      default: return tasks;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <svg className="animate-spin h-8 w-8 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span className="text-gray-500">Cargando tareas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded">
        Error al cargar tareas: {error.message || 'Intenta nuevamente.'}
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-3">
        <AnimatePresence>
          {filteredTasks().map(task => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
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
                    category
                  })}
                  disabled={toggleTask.isPending}
                  className="h-5 w-5 mr-3 rounded border-gray-300 text-blue-500 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
                />
                <motion.span
                  className="flex-grow text-lg select-none"
                  animate={{
                    color: task.completed ? "#9ca3af" : "#374151", // gray-400 : gray-700
                    textDecoration: task.completed ? "line-through" : "none",
                    scale: task.completed ? 0.97 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  {task.text}
                </motion.span>
              </label>
              <button
                onClick={() => openDeleteModal(task)}
                disabled={deleteTask.isPending}
                className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                ×
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Modal de confirmación (gestionado por Zustand) */}
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
                        useClientStore.getState().addNotification('Task deleted!', 'error');
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
    </>
  );
}