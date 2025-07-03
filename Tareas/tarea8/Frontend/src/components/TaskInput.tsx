import { useState } from "react";
import { useAddTask } from "../hooks/task";
import { useIsViewer } from "../hooks/useUserPermissions";
import toast from 'react-hot-toast';

export interface Props {
  tabId: string;
  onTaskAdded: (data: any) => void;
}

export function TaskInput({ tabId, onTaskAdded }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const isViewer = useIsViewer(tabId);

  const { mutateAsync } = useAddTask();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim()) return;
    setLoading(true);

    try {
      const boardId = parseInt(tabId, 10);
      if (isNaN(boardId)) throw new Error('ID de tablero inválido');

      const data = await mutateAsync({ text, tabId: boardId });
      setText("");
      onTaskAdded(data);
      toast.success('Tarea agregada');
    } catch (err) {
      console.error("Error al agregar la tarea:", err);
      toast.error("No se pudo agregar la tarea.");
    } finally {
      setLoading(false);
    }
  };

  if (isViewer) return null;

  return (
    <form
      method="POST"
      className="flex w-full mb-5"
      id="taskForm"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="action" value="add" />
      <input type="hidden" name="tabId" value={tabId} />

      <input
        type="text"
        name="text"
        placeholder="Escribe una nueva tarea..."
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-grow px-4 py-2 border border-indigo-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
      />

      <button
        type="submit"
        className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-r-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
        disabled={loading}
      >
        Agregar
      </button>
    </form>
  );
}
