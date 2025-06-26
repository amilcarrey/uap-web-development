import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import HomeTableros from "./components/HomeTableros";
import ListaTareas from "./components/ListaTareas";
import Notificaciones from "./components/Notificaciones";
import { useParams } from "@tanstack/react-router";

const App = () => {
  const { tableroId } = useParams({ from: "/tablero/$tableroId" });
  const { data: tableros = [], isLoading } = useQuery({
    queryKey: ["tableros"],
    queryFn: async () =>
      (await axios.get("http://localhost:8008/api/tableros", { withCredentials: true })).data,
  });

  if (isLoading) return <div>Cargando...</div>;

  // Si no hay tableros o no hay tablero seleccionado, muestra HomeTableros
  if (!tableroId || tableros.length === 0) {
    return (
      <div>
        <Notificaciones />
        <HomeTableros />
      </div>
    );
  }

  // Si hay tablero seleccionado, muestra la lista de tareas
  return (
    <div className="w-full flex flex-col items-center px-4 relative p-6">
      <Notificaciones />
      <main className="w-full flex justify-center mt-8 px-4">
        <div className="tareas w-full max-w-xl mx-auto mt-5 p-4">
          <ListaTareas />
        </div>
      </main>
    </div>
  );
};

export default App;