import React from "react";
import Header from "./components/Header";
import ListaTareas from "./components/ListaTareas";
import Notificaciones from "./components/Notificaciones"; // opcional
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "@tanstack/react-router";
import type { Tarea } from "./types";

const App = () => {
  const { tableroId } = useParams({ from: "/tablero/$tableroId" });

  const {
    data: tareas = [],
    isLoading,
    isError,
  } = useQuery<Tarea[]>({
    queryKey: ["tareas", tableroId],
    queryFn: () =>
      axios
        .get(`http://localhost:8008/tareas?tableroId=${tableroId}`)
        .then((res) => res.data),
    enabled: !!tableroId,
  });

  return (
    <div className="w-full flex flex-col items-center px-4 bg-white bg-opacity-10 relative p-6">
      <Header />
      <Notificaciones />

      <main className="w-full flex justify-center mt-8 px-4">
        <div className="tareas w-full max-w-xl mx-auto mt-5 p-4">
          {isError ? (
            <div className="text-red-500">Error cargando tareas.</div>
          ) : (
            <ListaTareas tareas={tareas} isLoading={isLoading} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
