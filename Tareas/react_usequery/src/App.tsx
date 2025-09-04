import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import TopBar from "./components/TopBar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Filters from "./components/Filters";
import { Task } from "./types/Task";
import "./styles/global.css";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");

  const fetchTasks = async (filter: string = "all") => {
    const res = await fetch("http://localhost:4321/api/filter_tasks?filter=" + filter); 
    if (res.status === 404) {
      console.error("Error: ", res.statusText);
      return;
    }

    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
    }
  };

  useEffect(() => {
    fetchTasks(filter);
  }, [filter]);

  const handleAddTask = async (text: string) => {
    const res = await fetch("http://localhost:4321/api/add_task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (res.ok) fetchTasks(filter);
  };

  const handleToggleTask = async (id: number) => {
    const res = await fetch("http://localhost:4321/api/toggle_task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
    }
  };

  const handleDeleteTask = async (id: number) => {
    const res = await fetch("http://localhost:4321/api/delete_task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
    }
  };

  const handleClearCompleted = async () => {
    const res = await fetch("http://localhost:4321/api/clear_completed", {
      method: "POST",
    });

    if (res.ok) fetchTasks(filter);
  };

  return (
    <div className="bg-[#f5f0eb] font-sans flex justify-center items-center h-screen w-full m-0 text-[18px]">
      <div className="flex flex-col items-center justify-start h-screen w-full">
        <Header />
        <TopBar />
        <div className="flex m-5 w-[70%]">
          <TaskForm onTaskAdded={handleAddTask} />
        </div>
        <div className="flex flex-col text-center justify-start w-[70%] bg-blanchedalmond rounded-[30px] p-4">
          <TaskList tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
          <Filters
            currentFilter={filter}
            onChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
