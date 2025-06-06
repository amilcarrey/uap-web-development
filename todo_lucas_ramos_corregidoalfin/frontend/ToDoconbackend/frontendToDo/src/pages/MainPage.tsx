import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { FormTarea } from "../components/formTarea";
import { useState } from "react";
import { TableroTareas } from "../components/TableroTareas";
import { ListarTareas } from "../components/Tareas";

const MainPage = () => {
  const [tableroId, setTableroId] = useState("");

  return (
    <div className="font-sans bg-blue-200 min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <Hero />
      </div>
      <div className="p-6 space-y-6">
        <TableroTareas
          tableroIdActual={tableroId}
          setTableroIdActual={setTableroId}
        />

        {tableroId && (
          <>
            <FormTarea tableroId={tableroId} />
            <ListarTareas tableroId={tableroId} />
          </>
        )}
      </div>
    </div>
  );
};

export default MainPage;
