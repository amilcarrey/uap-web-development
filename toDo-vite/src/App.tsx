import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import type { Task as TaskType } from "./types";
import Header from "./components/Header";

const BASE_URL = "http://localhost:4321/api";


function App() {
  const [tasks, setTasks] = useState<TaskType[]>([])
  const [filter, setFilter] = useState("all");

  async function handleAdd(text: string) {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", name: text }),
    });

    const newTask = await response.json();
    setTasks((prev) => [...prev, newTask]);
     setFilter("all");
  }


  async function handleComplete(id: string) {
  const response = await fetch(`${BASE_URL}/complete-task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "complete", id }),
  });

  const updatedTask = await response.json();
  setTasks((prev) =>
    prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
  );
}
async function handleDelete(id: string) {
  await fetch(`${BASE_URL}/delete-task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete", id }),
  });

  setTasks((prev) => prev.filter((task) => task.id !== id));
}

async function handleClearCompleted() {
  await fetch(`${BASE_URL}/clear-completed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "clearCompleted" }),
  });

  setTasks((prev) => prev.filter((task) => !task.completed));
}


  function handleFilter(filtro: string) {
  setFilter(filtro);
}
  
  useEffect(() => {
  fetch(`${BASE_URL}/tasks?filter=${filter}`)
    .then(res => res.json())
    .then(data => setTasks(data));
}, [filter]);


  return (
    <>
      <Header />

      <div className=' h-screen flex flex-col gap-10 items-center justify-start w-full bg-gray-900'>
        <TaskForm addTask={handleAdd} />
        <TaskList tasks={tasks} onComplete={handleComplete} onDelete={handleDelete} onClearCompleted={handleClearCompleted} onFilter={handleFilter} />
      </div>

    </>
  )
}

export default App
