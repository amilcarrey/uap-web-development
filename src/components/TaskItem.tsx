import { useState } from "react";
import type { Task } from "../types/Task";
import { useConfigStore } from "../store/useConfigStore";

interface Props {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const uppercase = useConfigStore((s) => s.uppercaseDescriptions);

  const handleEditSubmit = () => {
    onEdit(task.id, text.trim());
    setEditing(false);
  };

  return (
    <li className="flex justify-between items-center bg-white border border-gray-200 px-3 py-2 rounded-md shadow-sm">
      {editing ? (
        <input
          type="text"
          className="flex-grow mr-2 border px-2 py-1 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEditSubmit();
            if (e.key === "Escape") {
              setText(task.text);
              setEditing(false);
            }
          }}
        />
      ) : (
        <label className="flex items-center gap-2 flex-grow">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="accent-yellow-500"
          />
          <span
            className={`flex-grow ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {uppercase ? task.text.toUpperCase() : task.text}
          </span>
        </label>
      )}

      <div className="flex items-center gap-1">
        {editing ? (
          <>
            <button onClick={handleEditSubmit} className="text-green-500 hover:text-green-700">
              💾
            </button>
            <button onClick={() => { setEditing(false); setText(task.text); }} className="text-gray-400 hover:text-gray-600">
              ✖
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="text-yellow-500 hover:text-yellow-700">
              ✎
            </button>
            <button onClick={() => onDelete(task.id)} className="text-red-400 hover:text-red-600">
              ✕
            </button>
          </>
        )}
      </div>
    </li>
  );
}