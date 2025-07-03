import { Header } from "../components/Header";
import { FormTarea } from "../components/formTarea";
import { useState } from "react";
import { TableroTareas } from "../components/TableroTareas";
import { ListarTareas } from "../components/Tareas";

const MainPage = () => {
  const [tableroId, setTableroId] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#252850] via-[#333] to-[#fa991b] font-sans">
      <Header />
      <main className="max-w-3xl mx-auto pt-8 pb-16 px-2">
        <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl px-4 py-8 md:p-10 border border-white/20">
          <TableroTareas
            tableroIdActual={tableroId}
            setTableroIdActual={setTableroId}
          />

          <div className="h-px bg-gradient-to-r from-transparent via-orange-300/40 to-transparent my-7" />

          {tableroId ? (
            <div className="animate-fade-in space-y-7">
              <FormTarea tableroId={tableroId} />
              <ListarTareas tableroId={tableroId} />
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 opacity-70 select-none">
              <span className="text-xl text-white font-semibold mb-2">Seleccioná un tablero</span>
              <span className="text-base text-orange-100">¡Creá o elegí un tablero para empezar a organizar tus tareas!</span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MainPage;
