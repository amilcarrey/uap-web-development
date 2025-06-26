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
        className="flex-grow border border-gray-300 px-3 py-2 rounded-l"
        placeholder="What do you need to do?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
      >
        ADD
      </button>
    </form>
  );
}