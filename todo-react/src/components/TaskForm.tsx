import { useState, useCallback, type FormEvent } from "react";

interface Props {
  onAddTask: (texto: string) => void;
}

export function TaskForm({ onAddTask }: Props) {
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (texto.trim() === "") {
      setError("La tarea no puede estar vacía.");
      return;
    }
    onAddTask(texto.trim());
    setTexto("");
    setError("");
  }, [texto, onAddTask]);

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center mt-12 w-full">
      <input
        type="text"
        placeholder="Escribí una nueva tarea"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        className="flex-1 max-w-md h-12 rounded-l-full px-4 shadow-md border border-gray-300 focus:outline-none focus:ring focus:ring-purple-300"
      />
      <button type="submit" className="h-12 px-6 rounded-r-full bg-black text-violet-200 shadow-md hover:bg-violet-600 hover:shadow-violet-400 transition-colors duration-300">
        Agregar
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
}