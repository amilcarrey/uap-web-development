import { useState } from "react";
import { useTaskStore } from "../state/taskStore";

export default function TaskForm() {
  const [task, setTask] = useState("");
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    addTask(task.trim());
    setTask("");
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
