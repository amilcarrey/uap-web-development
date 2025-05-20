import { type FormEvent, useState } from "react";

interface Props {
  addTarea: (texto: string) => void;
}

export function NuevaTareaForm({ addTarea }: Props) {
  const [texto, setTexto] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (texto.trim()) {
      addTarea(texto.trim());
      setTexto("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="buscador">
      <input
        type="text"
        placeholder="Agregar una tarea..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <button type="submit">Agregar</button>
    </form>
  );
}
