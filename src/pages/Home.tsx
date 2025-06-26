import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskFilter from "../components/TaskFilter"; // 👈 nuevo
import {
  fetchTasks,
  addTask,
  toggleTask,
  deleteTask,
  clearCompleted,
} from "../services/TaskService";
import type { Task } from "../types/Task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "active">("all");

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAdd = async (text: string) => {
    await addTask(text);
    await loadTasks();
  };

  const handleToggle = async (id: number) => {
    await toggleTask(id);
    await loadTasks();
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    await loadTasks();
  };

  const handleClear = async () => {
    await clearCompleted();
    await loadTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4">Benja Organiza Tareas</h1>
        <TaskForm onAdd={handleAdd} />
        <TaskList tasks={filteredTasks} onToggle={handleToggle} onDelete={handleDelete} />
        <button
          className="mt-4 text-sm text-blue-600 hover:underline"
          onClick={handleClear}
        >
          Clear Completed
        </button>
        <TaskFilter filter={filter} setFilter={setFilter} />
      </div>
    </div>
  );
}