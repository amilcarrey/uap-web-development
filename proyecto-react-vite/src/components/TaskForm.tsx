import { useState } from "react";
import { useAddTask } from "../api/useTasks";
import { toast } from "react-hot-toast";

export default function TaskForm({ boardId }: { boardId: string }) {
  const [task, setTask] = useState("");
  const addTask = useAddTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    addTask.mutate({ name: task.trim(), boardId }, {
      onSuccess: () => {
        toast.success("Tarea agregada");
        setTask("");
      },
      onError: () => {
        toast.error("Error al agregar tarea");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center gap-4 w-full max-w-lg">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="w-3/4 p-2 text-lg border border-gray-300 rounded"
        placeholder="Agregar tarea"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Agregar
      </button>
    </form>
  );
}
