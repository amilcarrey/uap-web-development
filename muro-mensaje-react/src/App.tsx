import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { TareaList } from './components/TareaList';
import { type Tarea } from './types';
import { NuevaTareaForm } from './components/NuevoTareaForm';
import { Header } from './components/Header';

function App() {
  //const [search, setSearch] = useState("");
  const baseURL = 'http://localhost:4321/api';
  const [tareasList, setTareas] = useState<Tarea[]>([]);

  const addTarea = useCallback(async (action: string, content: string) => {
    const response = await fetch(`${baseURL}/tasks`,
      {
        method: "POST",
        body: JSON.stringify({ action, content }),
        headers: { "Content-Type": "application/json" }
      }
    );

    if (!response) { throw new Error("No se fetcheo bien") }

    const data: { tarea: Tarea } = await response.json();
    setTareas((current) => [...current, data.tarea]);
  }, [setTareas]
  );

  const borrarCompletas = useCallback(async (action: string) => {
    const response = await fetch(`${baseURL}/tasks`,
      {
        method: "POST",
        body: JSON.stringify({ action}),
        headers: { "Content-Type": "application/json" }
      }
    );

    if (!response) { throw new Error("No se fetcheo bien") }
    const data: {tasks: Tarea[]} = await response.json();
    console.log(data)
    setTareas(data.tasks);
  }, [setTareas]
  );


  const actionTarea = useCallback(async (action: string, id: string) => {
    const response = await fetch(`${baseURL}/tasks/${id}`,
      {
        method: "POST",
        body: JSON.stringify({ action: action }),
        headers: { "Content-Type": "application/json" }
      }
    );

    if (!response) { throw new Error("No encontramos la tarea") };
    const data: { tarea: Tarea } = await response.json();
    setTareas((current) => current.map((t) => t.id === data.tarea.id ? { ...t, checked: data.tarea.checked } : t))
  }, [setTareas])


  useEffect(() => {
    const fetchTareas = async () => {
      const response = await fetch(`${baseURL}/tasks`);
      const data: { tasks: Tarea[] } = await response.json();
      setTareas(data.tasks);
    };
    
    fetchTareas();
  }, [setTareas])

  return (
    <>
      <Header />
      <NuevaTareaForm addTarea={addTarea} />
      <TareaList tareas={tareasList} action={actionTarea} dltCompletas={borrarCompletas} />
    </>
  )
}

export default App
