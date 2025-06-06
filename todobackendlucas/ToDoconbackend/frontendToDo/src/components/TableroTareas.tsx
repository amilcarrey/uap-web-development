import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import toast from "react-hot-toast";
import { FiTrash, FiPlus } from "react-icons/fi";

interface Tablero {
  id: string;
  nombre: string;
}

export const useDeleteTablero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/tableros/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
      toast.success("Tablero eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar el tablero");
    },
  });
};

export const TableroTareas = ({
  tableroIdActual,
  setTableroIdActual,
}: {
  tableroIdActual: string;
  setTableroIdActual: (id: string) => void;
}) => {
  const queryClient = useQueryClient();
  const [nuevoNombre, setNuevoNombre] = useState("");
  const deleteTablero = useDeleteTablero();

  const handleEliminar = (id: string) => {
    if (confirm("¿Seguro que querés eliminar este tablero?")) {
      deleteTablero.mutate(id, {
        onSuccess: () => {
          if (tableroIdActual === id) setTableroIdActual("");
        },
      });
    }
  };

  const { data: tableros = [] } = useQuery<Tablero[]>({
    queryKey: ["tableros"],
    queryFn: async () => {
      const res = await api.get("/api/tableros");
      return res.data.tableros;
    },
  });

  const crearTablero = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/tableros", { nombre: nuevoNombre });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
      toast.success("Tablero creado");
      setNuevoNombre("");
    },
    onError: () => toast.error("Error al crear tablero"),
  });

  const handleCrear = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoNombre.trim()) crearTablero.mutate();
  };

  return (
    <section className="max-w-2xl mx-auto mb-8">
      <form
        onSubmit={handleCrear}
        className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-xl p-2 mb-5 shadow"
      >
        <input
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="flex-1 px-4 py-2 bg-white/70 rounded-l-xl text-gray-800 placeholder-gray-400 focus:outline-none"
          placeholder="Nuevo tablero..."
          maxLength={30}
        />
        <button
          type="submit"
          className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-xl font-semibold shadow transition-all disabled:opacity-60"
          disabled={!nuevoNombre.trim() || crearTablero.status === "pending"}
        >
          <FiPlus /> Crear
        </button>
      </form>

      <ul className="flex flex-wrap gap-3">
        {tableros.map((tablero) => (
          <li key={tablero.id}>
            <div
              className={`relative group flex items-center px-4 py-2 rounded-2xl shadow cursor-pointer transition-all
                ${
                  tablero.id === tableroIdActual
                    ? "bg-orange-500 text-white font-bold scale-105"
                    : "bg-white text-gray-800 hover:bg-orange-100"
                }`}
              tabIndex={0}
              onClick={() => setTableroIdActual(tablero.id)}
              onKeyDown={(e) => e.key === "Enter" && setTableroIdActual(tablero.id)}
              aria-label={`Seleccionar tablero: ${tablero.nombre}`}
            >
              <span className="truncate max-w-[110px]">{tablero.nombre}</span>
              <button
                type="button"
                aria-label="Eliminar tablero"
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50"
                tabIndex={-1}
                onClick={e => {
                  e.stopPropagation();
                  handleEliminar(tablero.id);
                }}
              >
                <FiTrash className="text-red-500 w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
export default TableroTareas;