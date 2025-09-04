import { useState } from "react";

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("El título no puede estar vacío");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // importante si usás JWT con cookies
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        throw new Error("Error al crear la tarea");
      }

      const nuevaTarea = await res.json();
      if (onTaskCreated) {
        onTaskCreated(nuevaTarea);
      }

      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("No se pudo crear la tarea");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white shadow rounded">
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Escribe el título"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          className="w-full border rounded p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Agrega detalles de la tarea"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Crear Tarea
      </button>
    </form>
  );
}
