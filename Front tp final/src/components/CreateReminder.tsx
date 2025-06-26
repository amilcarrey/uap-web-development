
import { useState } from "react";
import { useConfigStore } from "../store/configStore";
import { useAddTask } from "../hooks/useAddTask";
import { Plus} from "lucide-react";

export default function CreateReminder({ boardId }: { boardId: string }) {
  const [text, setText] = useState("");
  const { uppercaseDescriptions } = useConfigStore();
  const addTask = useAddTask(boardId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const finalText = uppercaseDescriptions ? trimmed.toUpperCase() : trimmed;
    addTask.mutate({ name: finalText, board_id: boardId });
    setText("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-pink-200">
      <h3 className="text-lg font-bold text-pink-700 mb-3">Nuevo Recordatorio</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un nuevo recordatorio..."
          className="flex-1 border border-pink-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button 
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition"
        >
          <>
              <Plus className="w-4 h-4" />
              
            </>
        </button>
      </form>
    </div>
  );
}