import { useState } from "react";
import { useCrearTarea } from "../hooks/useCrearTarea";
import { useClientStore } from "../store/clientStore";

interface AgregarTareaProps {
  tableroAlias?: string; 
}

export default function AgregarTarea({ tableroAlias }: AgregarTareaProps) {
  const [descripcion, setDescripcion] = useState("");
  const { mostrarToast } = useClientStore();
  const crearMutation = useCrearTarea(tableroAlias);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const desc = descripcion.trim();
    if (!desc) return;

    crearMutation.mutate({ descripcion: desc }, {
      onSuccess: () => {
        mostrarToast("Tarea agregada con éxito", "exito");
        setDescripcion("");
      },
      onError: () => mostrarToast("Error al agregar tarea", "error"),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Nueva tarea..."
        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        disabled={crearMutation.isPending}
      />
      <button
        type="submit"
        disabled={crearMutation.isPending || !descripcion.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {crearMutation.isPending ? "Agregando..." : "Agregar"}
      </button>
    </form>
  );
}