import { useClientStore } from '../stores/clientStore';
import { useTaskMutations } from '../hooks/useTasks';
import { useEffect } from 'react';

export default function AddTask({ category }) {
  const {
    modals,
    openAddTaskModal,
    closeAddTaskModal,
    editingTask,
    cancelEditing,
    addNotification
  } = useClientStore();

  const { isAddTaskModalOpen } = modals;
  const { addTask, updateTask } = useTaskMutations();
  const isEditing = !!editingTask;

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = e.target.task.value.trim();
    if (!text) return;

    if (isEditing) {
      updateTask.mutate(
        { id: editingTask.id, text, category },
        {
          onSuccess: () => {
            addNotification('Task updated!', 'success');
            closeAddTaskModal();
            cancelEditing();
          }
        }
      );
    } else {
      addTask.mutate(
        { text, category },
        {
          onSuccess: () => {
            addNotification('Task added!', 'success');
            closeAddTaskModal();
            e.target.reset();
          }
        }
      );
    }
  };

  useEffect(() => {
    if (isAddTaskModalOpen) {
      const form = document.querySelector('form');
      if (form) {
        form.task.value = isEditing ? editingTask.text : '';
        form.task.focus();
      }
    }
  }, [isAddTaskModalOpen, editingTask, isEditing]);

  return (
    <>
      {/* Botón siempre visible */}
      <button
        onClick={openAddTaskModal}
        className="w-full mb-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Task
      </button>

      {/* Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Task' : 'Add New Task'}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="task"
                placeholder="Task description"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    closeAddTaskModal();
                    if (isEditing) cancelEditing();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {isEditing ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}