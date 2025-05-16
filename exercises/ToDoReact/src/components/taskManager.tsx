import Title from "./title";
import CategoryButtons from "./categoryButtons";
import TaskInput from "./taskInput";
import Filters from "./filters";
import TaskList from "./taskList";
import { useEffect, useState } from "react";
import type { Task } from '../lib/tasks';

type TaskManagerProps = {
  filtro?: "completadas" | "pendientes";
};

function TaskManager({ filtro }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/api/tasks${filtro ? `?filtro=${filtro}` : ''}`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [filtro]);

  const handleAddTask = async (text: string) => {
    await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _method: 'ADD', text }),
    });
    fetchTasks();
  };

  const handleDeleteTask = async (id: number) => {
    await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _method: 'DELETE', id }),
    });
    fetchTasks();
  };

  const handleToggleCompletion = async (id: number) => {
    await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _method: 'TOGGLE', id }),
    });
    fetchTasks();
  };

  const handleDeleteCompleted = async () => {
    await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _method: 'DELETE_COMPLETED' }),
    });
    fetchTasks();
  };

  return (
    <div className="TaskManager flex flex-col items-center justify-center w-full h-full">
      <Title />
      <CategoryButtons />
      <TaskInput onAddTask={handleAddTask} />
      <Filters />
      <TaskList
        tasks={tasks}
        onDeleteTask={handleDeleteTask}
        onToggleCompletion={handleToggleCompletion}
      />
      <button onClick={handleDeleteCompleted}
        className="clearCompletedButton bg-orange-400 text-white font-bold cursor-pointer hover:bg-[rgb(139,90,0)] w-[80%] h-[40px] rounded-[5px] border-none flex items-center justify-center mb-[20px]">
        <i className="fas fa-trash"></i> Eliminar Completadas
      </button>
    </div>
  );
}

export default TaskManager;
