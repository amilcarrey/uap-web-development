import { useEffect, useState } from 'react';
import type { Tarea } from './types/tarea';
import ListaTarea from './components/ListaTarea';
import TareaNueva from './components/TareaNueva';
import Filtros from './components/Filtros';
import './App.css';

type Filtro = 'todas' | 'completas' | 'incompletas';

function App() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todas');

  useEffect(() => {
    const guardarTareas = localStorage.getItem('tareas');
    if (guardarTareas) {
      setTareas(JSON.parse(guardarTareas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }, [tareas]);

  const agregoTarea = (texto: string) => {
    if (!texto.trim()) return;
    const nueva: Tarea = {
      id: Date.now(),
      content: texto,
      completed: false,
    };
    setTareas([...tareas, nueva]);
  };

  const tareaCompletada = (id: number) => {
    setTareas(
      tareas.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const tareaEliminada = (id: number) => {
    setTareas(tareas.filter((t) => t.id !== id));
  };

  const eliminarCompletadas = () => {
    setTareas(tareas.filter((t) => !t.completed));
  };

  const filtrarTareas = tareas.filter((t) => {
    if (filtro === 'completas') return t.completed;
    if (filtro === 'incompletas') return !t.completed;
    return true;
  });

 return (
    <>
      <header>
        <h1 className="encabezado">TO-DO</h1>
      </header>

      <div className="container">
        <h4 id="subencabezado">Personal</h4>
        <h4 id="subencabezado">Professional</h4>
      </div>

      <TareaNueva onAgregar={agregoTarea} />

      <Filtros filtro={filtro} setFiltro={setFiltro} />

      <div className="to-do">
        <ListaTarea
          tareas={filtrarTareas}
          onToggle={tareaCompletada}
          onDelete={tareaEliminada}
        />

        <p className="clear-completed" onClick={eliminarCompletadas}>
          Clear Completed
        </p>
      </div>
    </>
  )
}

export default App;
