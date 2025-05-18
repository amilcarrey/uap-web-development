import React, { useState } from "react";

function FormularioAgregarTarea({ onNuevaTarea }) {
  const [texto, setTexto] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    await fetch("http://localhost:4321/api/tasks.json", {
      method: "POST",
      body: new URLSearchParams({
        action: "add",
        nuevaTarea: texto,
      }),
    });

    setTexto("");
    onNuevaTarea();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-pink-50 p-5 mx-auto my-4 w-11/12 max-w-2xl border-2 border-pink-200 rounded-lg">
      <label htmlFor="taskInput" className="block font-semibold mb-2">Cosas que faltan hacer:</label>
      <input
        id="taskInput"
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        className="w-full p-2 border border-pink-200 rounded mb-4"
        placeholder="Escribí una tarea"
      />
      <button className="w-full p-2 bg-pink-200 hover:bg-pink-300 font-bold border border-pink-300 rounded">
        Agregar a la lista
      </button>
    </form>
  );
}

export default FormularioAgregarTarea;
