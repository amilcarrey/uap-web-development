import React from "react";
import { Navigate } from "react-router-dom";
import { useTableros } from "../hooks/useTableros";

export const ToDoRedirectPage = () => {
  const { data: tableros, status } = useTableros();

if (status === "pending") {
  return <p>Cargando tareas...</p>;
}

  if (status === "error") return <p>Error al cargar los tableros</p>;

  if (tableros && tableros.length > 0) {
    return <Navigate to={`/tablero/${tableros[0].id}`} replace />;
  }

  return (
    <div>
      <h1>Crear un nuevo tablero</h1>
    </div>
  );
};

export default ToDoRedirectPage;
