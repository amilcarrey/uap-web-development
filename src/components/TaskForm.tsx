import { useState } from "react";

type Props = {
  onAdd: (text: string) => void;
};

export default function TaskForm({ onAdd }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") return;
    onAdd(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-1 rounded-lg flex items-center w-full" >
      <input
        type="text"
        placeholder="Nueva tarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border-none bg-transparent outline-none text-sm px-2 flex-1"
      />
      <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded ml-3 hover:bg-blue-700">
        Agregar
      </button>
    </form>
  );
}
