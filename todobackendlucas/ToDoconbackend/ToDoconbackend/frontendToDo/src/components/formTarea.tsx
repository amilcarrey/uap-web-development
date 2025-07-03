import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { tareasAPI } from "../services/tareasService";
import toast from "react-hot-toast";
import { FiPlusCircle } from "react-icons/fi";

const useCreateTarea = (tableroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (titulo: string) => {
      if (!tableroId) throw new Error("Falta el ID del tablero");
      return await tareasAPI.createTarea(parseInt(tableroId), { 
        titulo, 
        prioridad: 'media' 
      });
    },
    onSuccess: () => {
      // Actualizo la lista de tareas y muestro mensaje de éxito
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      toast.success("Tarea creada exitosamente");
    },
    onError: (error) => {
      console.error("Error al crear la tarea:", error);
      // Solo muestro un mensaje de error, no dos
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Error al crear la tarea");
      }
    },
  });
};

interface Props {
  tableroId: string;
}

export const FormTarea = ({ tableroId }: Props) => {
  const [titulo, setTitulo] = useState("");
  const { mutate: crearTarea, isPending } = useCreateTarea(tableroId);
  const [tocado, setTocado] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setTocado(true);
      return;
    }
    crearTarea(titulo, {
      onSuccess: () => {
        setTitulo("");
        setTocado(false);
      },
    });
  };

  const error = tocado && !titulo.trim();

  return (
    <form
      id="form-tarea"
      className="flex flex-col md:flex-row items-center gap-3 bg-white/10 p-4 rounded-xl shadow max-w-xl mx-auto mb-3 mt-2 border border-white/20 backdrop-blur"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <input
        name="titulo"
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        onBlur={() => setTocado(true)}
        className={`flex-1 px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border
          ${error ? "border-red-500 ring-red-300" : "border-gray-300"}
        `}
        placeholder="Escribí una tarea..."
        disabled={isPending}
        maxLength={50}
        aria-label="Nombre de la tarea"
        required
      />
      <button
        type="submit"
        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition-all text-base disabled:opacity-60"
        disabled={isPending || !titulo.trim()}
        aria-label="Agregar tarea"
      >
        <FiPlusCircle className="w-5 h-5" />
        {isPending ? "Agregando..." : "Agregar"}
      </button>
      {error && (
        <span className="text-red-500 text-sm ml-2 animate-shake">
          Ingresá un nombre de tarea.
        </span>
      )}
    </form>
  );
};
