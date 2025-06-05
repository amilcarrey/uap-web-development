import { useClientStore } from '../stores/clientStore';
import { useTaskMutations } from '../hooks/useTasks';

export default function AddTask({ category }) {
  const { modals, openAddTaskModal, closeAddTaskModal } = useClientStore();
  const { isAddTaskModalOpen } = modals;
  const { addTask } = useTaskMutations();

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = e.target.task.value.trim();
    if (text) {
      addTask.mutate({ text, category }, {
        onSuccess: () => {
          useClientStore.getState().addNotification('Task added successfully!', 'success');
          closeAddTaskModal();
          e.target.reset();
        },
      });
    }
  };

  return (
    <>
      <button
        onClick={openAddTaskModal}
        className="w-full mb-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Task
      </button>

      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
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
                  onClick={closeAddTaskModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}