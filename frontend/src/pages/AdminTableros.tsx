import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Tablero = { id: string; nombre: string };

const AdminTableros = () => {
  const queryClient = useQueryClient();
  const [nuevoNombre, setNuevoNombre] = useState("");

  const { data: tableros = [] } = useQuery<Tablero[]>({
    queryKey: ["tableros"],
    queryFn: async () => {
      const res = await fetch("http://localhost:4000/api/boards", {
        credentials: "include",
      });
      return res.json();
    },

  });

  const crearTablero = useMutation({
    mutationFn: async (nombre: string) => {
      const res = await fetch("http://localhost:4000/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nombre }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
      setNuevoNombre("");
    },
  });

  const eliminarTablero = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`http://localhost:4000/api/boards/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
    },
  });

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Administrar Tableros</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (nuevoNombre.trim()) crearTablero.mutate(nuevoNombre.trim());
        }}
        className="flex gap-2 mb-6"
      >
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nuevo tablero"
          className="flex-1 border px-2 py-1"
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded">Crear</button>
      </form>

      <ul className="space-y-2">
        {tableros.map((tab) => (
          <li key={tab.id} className="flex justify-between items-center border px-2 py-1 rounded">
            <span>{tab.nombre}</span>
            <button
              onClick={() => eliminarTablero.mutate(tab.id)}
              className="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminTableros;
