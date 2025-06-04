import { Link } from "react-router-dom";
import { useBoards, useAddBoard, useDeleteBoard } from "../api/useBoards";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Home() {
  const { data: boards, isLoading } = useBoards();
  const addBoard = useAddBoard();
  const deleteBoard = useDeleteBoard();
  const [nombre, setNombre] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const id = nombre.toLowerCase().replace(/\s+/g, "-");

    addBoard.mutate({ id, nombre }, {
      onSuccess: () => {
        toast.success("Tablero creado");
        setNombre("");
      },
      onError: () => toast.error("Error al crear tablero"),
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Tableros</h1>

      {isLoading ? (
        <p>Cargando tableros...</p>
      ) : (
        <ul className="flex flex-col gap-2 mb-6">
          {boards?.map((b) => (
            <li key={b.id} className="flex justify-between items-center bg-orange-100 px-4 py-2 rounded">
              <Link to={`/tablero/${b.id}`} className="font-semibold hover:underline">
                {b.nombre}
              </Link>
              <button
                onClick={() =>
                  deleteBoard.mutate(b.id, {
                    onSuccess: () => toast.success("Tablero eliminado"),
                    onError: () => toast.error("No se pudo eliminar"),
                  })
                }
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="flex gap-2 justify-center">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nuevo tablero"
          className="border px-3 py-1 rounded w-2/3"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
          Crear
        </button>
      </form>
    </div>
  );
}
