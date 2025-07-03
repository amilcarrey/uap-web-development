import api from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

const useCreateTarea = (tableroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nombre: string) => {
      if (!tableroId) throw new Error("Falta el ID del tablero");
      console.log(`📝 Creando tarea "${nombre}" en tablero ${tableroId}`);

      const response = await api.post("/api/tareas", { nombre, tableroId });
      console.log("✅ Tarea creada:", response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
      toast.success("Tarea creada exitosamente");
    },
    onError: (error: any) => {
      console.error("❌ Error al crear la tarea:", error);
      let errorMessage = "Error al crear la tarea";

      if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para crear tareas en este tablero";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
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
    if (!nombre.trim()) {
      toast.error("El nombre de la tarea no puede estar vacío");
      return;
    }

    console.log(`📋 Enviando tarea para tablero: ${tableroId}`);
    crearTarea(nombre.trim(), {
      onSuccess: () => {
        setNombre("");
        // Opcionalmente enfocar el input nuevamente
        const input = document.getElementById(
          "nueva-tarea-input"
        ) as HTMLInputElement;
        if (input) input.focus();
      },
    });
  };

  // Debug: mostrar tableroId temporalmente
  console.log("FormTarea - tableroId actual:", tableroId);

  return (
    <form
      id="form-tarea"
      className="flex justify-center mb-3 mt-2 max-w-lg mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        id="nueva-tarea-input"
        name="nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="p-2 w-3/4 rounded border border-gray-300 text-lg focus:outline-none focus:ring focus:ring-blue-300"
        placeholder="Nombre de la tarea"
        disabled={isPending}
        autoFocus
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
