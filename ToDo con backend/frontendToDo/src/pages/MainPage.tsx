import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { FormTarea } from "../components/formTarea";
import { useState } from "react";
import { TableroTareas } from "../components/TableroTareas";
import { ListarTareas } from "../components/Tareas";

const MainPage = () => {
  const [tableroId, setTableroId] = useState("");

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto p-4">
        <Hero />
      </div>
      <div className="p-4 space-y-6">
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
