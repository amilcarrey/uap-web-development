import { useTasksByCategory, useTaskMutations } from '../hooks/useTasks';
import { useClientStore } from '../stores/clientStore';

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

  if (isLoading) return <div className="p-4 text-center text-gray-500">Loading tasks...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error.message}</div>;

  return (
    <>
      <ul className="space-y-3">
        {filteredTasks().map(task => (
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
                  category
                })}
                disabled={toggleTask.isPending}
                className="h-5 w-5 mr-3 rounded border-gray-300 text-blue-500 focus:ring-blue-500 disabled:opacity-50"
              />
              <span className={`flex-grow ${
                task.completed ? 'line-through text-gray-400' : 'text-gray-700'
              }`}>
                {task.text}
              </span>
            </label>
            <button
              onClick={() => openDeleteModal(task)}
              disabled={deleteTask.isPending}
              className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              ×
            </button>
          </li>
        ))}
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