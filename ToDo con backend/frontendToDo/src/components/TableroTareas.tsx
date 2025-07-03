import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import toast from "react-hot-toast";

interface Tablero {
  id: string;
  nombre: string;
}

const useDeleteTablero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/tableros/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
      toast.success("Tablero eliminado");
    },
    onError: (error: any) => {
      // Si es error de autenticación, podrías manejar logout acá
      toast.error(
        error?.response?.data?.message || "Error al eliminar el tablero"
      );
    },
  });
};

const useLimpiarCompletadas = (tableroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log(`🧹 Limpiando tareas completadas del tablero ${tableroId}`);
      await api.delete(`/api/tableros/${tableroId}/tareas/completadas`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      toast.success("Tareas completadas eliminadas");
    },
    onError: (error: any) => {
      console.error("❌ Error al limpiar tareas:", error);
      const errorMessage =
        error.response?.status === 403
          ? "No tienes permisos para eliminar tareas"
          : "Error al eliminar tareas completadas";
      toast.error(errorMessage);
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
  const limpiarCompletadas = useLimpiarCompletadas(tableroIdActual);

  const handleEliminar = (id: string) => {
    if (confirm("¿Seguro que querés eliminar este tablero?")) {
      deleteTablero.mutate(id, {
        onSuccess: () => {
          if (tableroIdActual === id) {
            setTableroIdActual("");
          }
        },
      });
    }
  };

  const {
    data: tableros = [],
    isLoading,
    error,
  } = useQuery<Tablero[]>({
    queryKey: ["tableros"],
    queryFn: async () => {
      const res = await api.get("/api/tableros");
      return res.data.tableros;
    },
  });

  const crearTablero = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/tableros", { name: nuevoNombre });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableros"] });
      toast.success("Tablero creado");
      setNuevoNombre("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error al crear tablero");
    },
  });

  const handleCrear = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoNombre.trim()) {
      crearTablero.mutate();
    }
  };

  const handleLimpiarCompletadas = () => {
    if (confirm("¿Seguro que querés limpiar las tareas completadas?")) {
      limpiarCompletadas.mutate();
    }
  };

  if (isLoading) return <p>Cargando tableros...</p>;
  if (error) return <p>Error al cargar tableros</p>;

  return (
    <section className="max-w-xl mx-auto mb-6">
      <form onSubmit={handleCrear} className="flex mb-4">
        <input
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="flex-1 border p-2 rounded-l"
          placeholder="Nuevo tablero"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Crear
        </button>
      </form>

      <ul className="flex flex-wrap gap-2">
        {tableros.map((tablero) => (
          <li key={tablero.id} className="flex items-center">
            <button
              onClick={() => setTableroIdActual(tablero.id)}
              className={`px-3 py-2 rounded focus:outline-none ${
                tablero.id === tableroIdActual
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tablero.nombre}
            </button>
            <button
              className="text-red-500 hover:underline ml-2"
              onClick={() => handleEliminar(tablero.id)}
              type="button"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {tableroIdActual && (
        <div className="mt-4">
          <button
            onClick={handleLimpiarCompletadas}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Limpiar completadas
          </button>
        </div>
      )}
    </section>
  );
};
export default TableroTareas;
