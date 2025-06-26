import { useEffect, useState } from "react";
import { useUIStore } from "../store";
import { useUpdateTarea } from "../hooks/useTareas";

type Props = {
  onAdd: (text: string) => void;
  boardId: string;
  userRole: "owner" | "editor" | "viewer";
};

export default function TaskForm({ onAdd, boardId, userRole }: Props) {
  const { tareaEditando, setTareaEditando } = useUIStore();
  const [text, setText] = useState("");
  const updateTarea = useUpdateTarea();

  useEffect(() => {
    setText(tareaEditando?.text ?? "");
  }, [tareaEditando]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (userRole === "viewer") return; // bloquea intento desde el form

    const trimmed = text.trim();
    if (!trimmed) return;

    if (tareaEditando) {
      updateTarea.mutate(
        { id: tareaEditando.id, text: trimmed, boardId },
        {
          onSuccess: () => {
            setTareaEditando(null);
            setText("");
          },
        }
      );
    } else {
      onAdd(trimmed);
      setText("");
    }
  };

  const handleCancel = () => {
    setTareaEditando(null);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-1 rounded-lg flex items-center w-full"
    >
      <input
        type="text"
        placeholder="Nueva tarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border-none bg-transparent outline-none text-sm px-2 flex-1"
        disabled={userRole === "viewer"}
      />

      {tareaEditando && (
        <button
          type="button"
          onClick={handleCancel}
          className="text-sm text-gray-500 hover:underline"
        >
          Cancelar
        </button>
      )}
      <button
        type="submit"
        className="bg-blue-500 text-white px-5 py-2 rounded ml-3 hover:bg-blue-700"
        disabled={userRole === "viewer"}
      >
        {tareaEditando ? "Guardar" : "Agregar"}
      </button>
    </form>
  );
}
