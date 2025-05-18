import React, { useEffect, useState } from "react";
import FormularioAgregarTarea from "./components/FormularioAgregarTarea";
import ListaDeTareas from "./components/ListaDeTareas";
import Filtros from "./components/Filtros";

function App() {
  const [tareas, setTareas] = useState([]);
  const [filtro, setFiltro] = useState("todas");

  const fetchTareas = async () => {
    const res = await fetch("http://localhost:4321/api/tasks.json");
    const data = await res.json();
    setTareas(data.tareas || []);
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  const tareasFiltradas = tareas.filter(t => {
    if (filtro === "completadas") return t.completada;
    if (filtro === "incompletas") return !t.completada;
    return true;
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-center p-4 bg-pink-200 border-2 border-pink-300 text-2xl font-bold">TO DO LIST:</h1>
      <h2 className="text-4xl text-red-600 font-bold text-center">Prueba Tailwind</h2>

      <FormularioAgregarTarea onNuevaTarea={fetchTareas} />
      <Filtros filtroActual={filtro} setFiltro={setFiltro} />
      <ListaDeTareas tareas={tareasFiltradas} onCambio={fetchTareas} />
    </div>
  );
}

export default App;
