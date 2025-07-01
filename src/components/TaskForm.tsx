import { useState } from "react";
import type { FormEvent } from "react";

interface Props {
  onAdd: (text: string) => void;
}

export default function TaskForm({ onAdd }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd(input);
    setInput("");
  };

  return (
    <form className="flex mb-4" onSubmit={handleSubmit}>
      <input
        type="text"
        className="flex-grow border border-gray-300 px-4 py-2 rounded-l-md shadow-sm focus:outline-yellow-500"
        placeholder="¿Qué necesitas hacer?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="bg-yellow-500 text-white px-5 rounded-r-md hover:bg-yellow-600 transition"
      >
        Agregar
      </button>
    </form>
  );
}