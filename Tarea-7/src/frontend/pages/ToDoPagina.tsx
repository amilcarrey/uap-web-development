import React from "react";
import { useTableros } from "../hooks/useTableros";
import { FilterForm } from "../components/Filtros";
import { ListaTareas } from "../components/ListaTarea";
import { ToastContainer } from "../components/ContenedorNotificaciones";
import CrearTableroForm from "../components/TablerosTareas";

export const ToDoPage = () => {
  const { data: tableros, isLoading, isError } = useTableros();

  if (isLoading) return <p>Cargando tableros...</p>;
  if (isError) return <p>Error al cargar los tableros</p>;  

  return (
    <div>
      <header className="encabezado">TO - DO</header>

      <main className="container">
        <div>
          <h2 id="subencabezado">Filtrar tareas</h2>
          <FilterForm />
        </div>
        
        <div>
          <h2 id="subencabezado">
            {tableros && tableros.length > 0
              ? "Lista de tareas"
              : "No hay tableros aún, creá uno para empezar"}
          </h2>

          {tableros && tableros.length > 0 ? (
            <ListaTareas tableroId={tableros[0].id} />
          ) : (
            <p>No hay tareas para mostrar.</p>
          )}
        </div>

        <CrearTableroForm />
      </main>

      <ToastContainer />
    </div>
  );
};

export default ToDoPage;
