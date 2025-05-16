import { useEffect, useState } from 'react';
import Tarea from './components/Tarea';
import AgregarTarea from './components/AgregarTarea';
import FiltroTareas from './components/FiltroTarea';
import EliminarCompletadas from './components/EliminarCompletadas';
import './App.css';
import './index.css'; 

type TareaType = {
  id: number;
  descripcion: string;
  completada: boolean;
};

function App() {
  const [tareas, setTareas] = useState<TareaType[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4321/api/tareas')
      .then(res => res.json())
      .then(data => {
        setTareas(data);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al cargar tareas:', err);
        setCargando(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-200 h-screen w-screen">
      <h1 className="my-5 mx-auto text-center text-black text-7xl font-bold">ToDo</h1>
      
      <div className="categories flex justify-center mb-5 space-x-8">
        <button type="button" className="boton-estilo">Personal</button>
        <button type="button" className="boton-estilo">+</button>
        <button type="button" className="boton-estilo">Profesional</button>
      </div>

      <AgregarTarea onAgregar={(nueva) => setTareas(prev => [...prev, nueva])} />
      <FiltroTareas onFiltrar={(filtradas) => setTareas(filtradas)} />

      {cargando ? (
        <p>Cargando tareas...</p>
      ) : (
        <>
          {tareas.map(tarea => (
            <Tarea
              key={tarea.id}
              tarea={tarea}
              onEliminar={(id) => setTareas(t => t.filter(tar => tar.id !== id))}
              onToggle={(id) => {
                setTareas(t =>
                  t.map(tar =>
                    tar.id === id ? { ...tar, completada: !tar.completada } : tar
                  )
                );
              }}
            />
          ))}
          <EliminarCompletadas
            onEliminar={(ids) =>
              setTareas(t => t.filter(tar => !ids.includes(tar.id)))
            }
          />
        </>
      )}
    </div>
  );  
}

export default App;
