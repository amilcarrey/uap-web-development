// Tareas.tsx
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { tareasAPI } from "../services/tareasService";
import type { Tarea } from "../services/tareasService";
import { useTareas } from "../hooks/useTableros";
import { useConfiguracion } from "./Configuraciones";
import toast from "react-hot-toast";

interface ListarTareasProps {
  tableroId: string;
}

export const ListarTareas = ({ tableroId }: ListarTareasProps) => {
  const [filtro, setFiltro] = useState("todos");
  const { descripcionMayusculas } = useConfiguracion();

  const {
    data: tareas = [],
    isLoading,
    isError,
  } = useTareas(tableroId, filtro);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltro(e.target.value);
    toast.success(`Filtro cambiado a: ${e.target.value}`, {
      duration: 2000,
    });
  };

  if (!tableroId) return null;

  if (isLoading) {
    return <div className="text-center text-gray-500">Cargando tareas...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error al cargar las tareas.
      </div>
    );
  }

  return (
    <section className="max-w-lg mx-auto">
      <div className="mb-4 flex justify-end">
        <select
          value={filtro}
          onChange={handleFiltroChange}
          className="p-2 border rounded text-sm mx-auto"
        >
          <option value="todos">Todas</option>
          <option value="completadas">Completadas</option>
          <option value="pendientes">Pendientes</option>
        </select>
      </div>
      <ul className="font-sans max-w-lg mx-auto p-5">
        {tareas.map((tarea: Tarea) => (
          <TareaItem
            key={tarea.id}
            tarea={tarea}
            tableroId={tableroId}
            descripcionMayusculas={descripcionMayusculas}
          />
        ))}
      </ul>
    </section>
  );
};

interface TareaItemProps {
  tarea: Tarea;
  tableroId: string;
  descripcionMayusculas: boolean;
}

export const TareaItem = ({
  tarea,
  tableroId,
  descripcionMayusculas,
}: TareaItemProps) => {
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState(tarea.titulo);

  const toggleMutation = useMutation({
    mutationFn: async () => {
      await tareasAPI.updateTarea(parseInt(tableroId), tarea.id, {
        completada: !tarea.completada
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      toast.success(
        `Tarea ${tarea.completada ? "desmarcada" : "marcada"} como completada`,
        { duration: 2000 }
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await tareasAPI.deleteTarea(parseInt(tableroId), tarea.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      toast.success("Tarea eliminada correctamente", { duration: 2000 });
    },
  });

  const editMutation = useMutation({
    mutationFn: async () => {
      await tareasAPI.updateTarea(parseInt(tableroId), tarea.id, {
        titulo: nuevoTitulo
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      setEditando(false);
      toast.success(`Tarea actualizada correctamente a: ${nuevoTitulo}`, {
        duration: 2000,
      });
    },
  });

  const handleEdit = () => {
    if (nuevoTitulo.trim() === "") {
      toast.error("El título no puede estar vacío");
      return;
    }
    editMutation.mutate();
  };

  return (
    <li className="flex items-center justify-between p-2 border-b border-gray-200">
      {editando ? (
        <input
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
          className="text-lg border rounded px-2 py-1 w-full mr-2"
          onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
        />
      ) : (
        <span
          className={`text-lg flex-1 ${
            tarea.completada ? "line-through text-gray-500" : ""
          }`}
        >
          {descripcionMayusculas ? tarea.titulo.toUpperCase() : tarea.titulo}
        </span>
      )}

      <input
        type="checkbox"
        checked={tarea.completada}
        onChange={() => toggleMutation.mutate()}
        className="form-checkbox h-5 w-5 text-blue-600 ml-2"
      />

      {editando ? (
        <>
          <button
            onClick={handleEdit}
            className="ml-2 text-sm text-green-600 hover:underline"
          >
            Guardar
          </button>
          <button
            onClick={() => {
              setEditando(false);
              setNuevoTitulo(tarea.titulo);
            }}
            className="ml-2 text-sm text-gray-600 hover:underline"
          >
            Cancelar
          </button>
        </>
      ) : (
        <button
          onClick={() => setEditando(true)}
          className="ml-2 text-sm text-blue-600 hover:underline"
        >
          Editar
        </button>
      )}

      <button
        onClick={() => deleteMutation.mutate()}
        className="ml-2 text-sm text-red-600 hover:underline"
      >
        Eliminar
      </button>
    </li>
  );
};
