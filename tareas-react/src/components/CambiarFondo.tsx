import { useFondoStore } from "./store/useFondoStore";
import { useState } from "react";

export default function CambiarFondo() {
  const fondoUrl = useFondoStore((s) => s.fondoUrl);
  const setFondoUrl = useFondoStore((s) => s.setFondoUrl);
  const [input, setInput] = useState(fondoUrl || "");

  return (
    <form
      className="flex gap-2 items-center mb-4"
      onSubmit={e => {
        e.preventDefault();
        setFondoUrl(input);
      }}
    >
      <input
        type="url"
        placeholder="URL de imagen de fondo"
        value={input}
        onChange={e => setInput(e.target.value)}
        className="border rounded px-2 py-1 w-72"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Cambiar fondo
      </button>
    </form>
  );
}