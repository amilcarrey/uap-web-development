import { useState } from "react";

type Tarea = {
  id: number;
  descripcion: string;
  completada: boolean;
};

type Props = {
  onAgregar: (tarea: Tarea) => void;
};

function AgregarTarea({ onAgregar }: Props) {
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const desc = descripcion.trim();
    if (!desc) return;

    try {
      const res = await fetch("http://localhost:4321/api/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ descripcion: desc }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        alert(error.error || "Error al agregar tarea");
        return;
      }

      const data = await res.json();
      if (!data.tarea) {
        alert("La respuesta del servidor no es válida.");
        return;
      }

      onAgregar(data.tarea);
      setDescripcion(""); // Limpiar el input
    } catch (error) {
      alert("Error de red o servidor");
      console.error(error);
    }
  };

  return (
    <div className="form-container p-4">
      <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
        <input
          type="text"
          className="bg-white text-center px-10 py-2 rounded shadow"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Enter Task"
          required
        />
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default AgregarTarea;
