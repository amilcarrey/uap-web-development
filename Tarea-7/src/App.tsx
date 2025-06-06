// App.tsx
import React from "react";
import { FilterForm } from "./components/React/Filtros";
import { ListaTareas } from "./components/React/ListaTarea";
import { ToastContainer } from "./components/React/ContenedorNotificaciones";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
  tableroId: string;
}

const queryClient = new QueryClient();

const App = ({ tableroId }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <header className="encabezado">TO - DO</header>

      <main className="container">
        <div>
          <h2 id="subencabezado">Filtrar tareas</h2>
          <FilterForm />
        </div>
        <div>
          <h2 id="subencabezado">Lista de tareas</h2>
          <ListaTareas tableroId={tableroId} />
        </div>
      </main>

      <ToastContainer />
    </QueryClientProvider>
  );
};

export default App;
