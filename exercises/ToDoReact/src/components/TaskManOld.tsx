/*import Title from "./title";
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
  const [tasks, setTasks] = useState<Task[]>([]); //guarda las tareas actuales (completas, pendientes o todas). 
  // setTasks: función para actualizar el estado cuando llegan nuevas tareas del back

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/api/tasks${filtro ? `?filtro=${filtro}` : ''}`); //hace la petición HTTP al servidor para pedir tareas si tiene filtro agrega
    const data = await res.json(); // convierte la respuesta a JSON
    setTasks(data); // actualiza el estado con las tareas que llegaron del servidor
  };

  useEffect(() => {
    fetchTasks();
  }, [filtro]); //escuchamos cambios en el filtro y si cambia lo volvemos a pedir al servidor

  const handleAddTask = async (text: string) => {  // función que se ejecuta cuando se agrega una nueva tarea llama a la API
    await fetch(`${API_URL}/api/tasks`, {
      method: 'POST', //
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _method: 'ADD', text }),
    });
    fetchTasks(); //<-- Vos manualmente volvías a pedir todas las tareas
  };

  const handleDeleteTask = async (id: number) => {
    await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _method: 'DELETE', id }),
    });
    fetchTasks();//<-- Vos manualmente volvías a pedir todas las tareas
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
        onToggleCompletion={handleToggleCompletion} //funcion flecha que se pasa como prop a TaskList 
        onEditTasks={handleEditTask} //funcion flecha que se pasa como prop a TaskList
      />
      <button onClick={handleDeleteCompleted}
        className="clearCompletedButton bg-orange-400 text-white font-bold cursor-pointer hover:bg-[rgb(139,90,0)] w-[80%] h-[40px] rounded-[5px] border-none flex items-center justify-center mb-[20px]">
        <i className="fas fa-trash"></i> Eliminar Completadas
      </button>
    </div>
  );
}

export default TaskManager;*/
