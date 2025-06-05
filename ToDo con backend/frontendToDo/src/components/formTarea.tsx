import api from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

const useCreateTarea = (tableroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nombre: string) => {
      if (!tableroId) throw new Error("Falta el ID del tablero");
      const response = await api.post("/api/tareas", { nombre, tableroId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      toast.success("Tarea creada exitosamente");
    },
    onError: (error) => {
      console.error("Error al crear la tarea:", error);
      toast.error("Error al crear la tarea");
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      }
    },
  });
};

interface Props {
  tableroId: string;
}

export const FormTarea = ({ tableroId }: Props) => {
  const [nombre, setNombre] = useState("");
  const { mutate: crearTarea, isPending } = useCreateTarea(tableroId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    crearTarea(nombre, {
      onSuccess: () => setNombre(""),
    });
  };

  return (
    <form
      id="form-tarea"
      className="flex justify-center mb-3 mt-2 max-w-lg mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        name="nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="p-2 w-3/4 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:ring-blue-300"
        placeholder="Nombre de la tarea"
        required
      />
      <button
        type="submit"
        className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
        disabled={isPending}
      >
        {isPending ? "Agregando..." : "Agregar"}
      </button>
    </form>
  );
};
