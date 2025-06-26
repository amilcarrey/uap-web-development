import { useTaskStore } from "../store/taskStore";
import { useDeleteTask } from "../hooks/useDeleteTask";

export default function ConfirmDeleteModal() {
  const { confirmDeleteTask, setConfirmDeleteTask } = useTaskStore();
  const { mutate: deleteTask } = useDeleteTask();

  if (!confirmDeleteTask) return null;

  const handleConfirm = () => {
    deleteTask(confirmDeleteTask.id.toString());
    setConfirmDeleteTask(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[300px] text-center">
        <p className="mb-4 text-gray-800 font-semibold">
          ¿Estás seguro de que quieres eliminar este recordatorio?
        </p>
        <div className="flex justify-between">
          <button
            onClick={handleConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sí, eliminar
          </button>
          <button
            onClick={() => setConfirmDeleteTask(null)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
