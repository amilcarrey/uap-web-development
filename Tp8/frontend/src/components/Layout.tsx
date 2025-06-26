//src/components/Layout
import { Link, Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type Tablero = { id: string; nombre: string };

const Layout = () => {
  const { tableroId } = useParams();
  const { data: tableros = [] } = useQuery<Tablero[]>({
    queryKey: ["tableros"],
    queryFn: async () => {
      const res = await fetch("http://localhost:4000/api/boards", {
        credentials: "include",
      });
      return res.json();
    },
  });


  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4 relative">
      <h1 className="text-3xl font-bold text-center mb-6 text-pink-600">
        Lista de Tareas
      </h1>
      {/* <h2 className="text-center text-gray-700 text-sm mb-2">
        {tableroId ? `Estás en el tablero: ${tableroId}` : "Seleccioná un tablero"}
      </h2> */}


      <nav className="flex gap-4 justify-center mb-4">
        {tableros.map((tab) => (
          <Link
            key={tab.id}
            to={`/tablero/${tab.id}`}
            className={`px-3 py-1 rounded ${
              tableroId === tab.id
                ? "bg-blue-600 text-white"
                : "text-blue-600 hover:underline"
            }`}
          >
            {tab.nombre}
          </Link>
        ))}
      </nav>

      <Link
        to="/admin"
        className="absolute top-4 right-4 bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition-colors"
        >
        ⚙️ Gestionar tableros
      </Link>

      <Outlet />
    </div>
  );
};

export default Layout;
