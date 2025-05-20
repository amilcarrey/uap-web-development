import React, { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import TaskFilters from "./TaskFilters";
import ClearCompletedButton from "./ClearCompletedButton";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type Filter = "all" | "done" | "undone";

const API_BASE = "http://localhost:4321";

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks?filter=${filter}`);
      const data = await res.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newTaskText.trim() }),
      });
      const data = await res.json();
      setTasks((prev) => [...prev, data.task]);
      setNewTaskText("");
    } catch (error) {
      console.error("Error agregando tarea:", error);
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });
      const data = await res.json();
      setTasks((prev) => prev.map((task) => (task.id === id ? data.task : task)));
    } catch (error) {
      console.error("Error completando tarea:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete" }),
      });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error borrando tarea:", error);
    }
  };

  const clearCompleted = async () => {
    try {
      await fetch(`${API_BASE}/api/tasks/clear-completed`, {
        method: "POST",
      });
      setTasks((prev) => prev.filter((task) => !task.completed));
    } catch (error) {
      console.error("Error limpiando tareas:", error);
    }
  };

  return (
    <>
      <header className="text-center bg-[#e49d89dc] p-6 rounded-md">
        <h1 className="text-4xl font-bold text-black">Gestor de tareas</h1>
      </header>

      <nav className="flex justify-around bg-[#e8af9695] p-6 rounded-md mt-4">
        <div className="text-lg cursor-pointer hover:border-b-4 border-[#e08123]">Personal</div>
        <div className="text-lg cursor-pointer hover:border-b-4 border-[#e08123]">Profesional</div>
      </nav>

      <div className="flex items-center justify-between p-4 bg-white rounded-md mt-4">
        <TaskForm value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} onSubmit={addTask} />
      </div>

      <div className="max-w-[900px] mx-auto rounded-lg p-6 text-center mt-4">
        <TaskList tasks={tasks} onToggle={toggleComplete} onDelete={deleteTask} />
      </div>

      <ClearCompletedButton onClear={clearCompleted} />
      <TaskFilters currentFilter={filter} onChange={setFilter} />
    </>
  );
};

export default TaskManager;
