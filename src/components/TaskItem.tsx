import React, { useState } from "react";
import type { Task } from "../type";
import { useTaskActions } from "../hooks/useTaskActions";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

const TaskItem: React.FC<Props> = ({ task, onToggle, onDelete }) => {
  const { editTask } = useTaskActions();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim() !== "") {
      editTask.mutate({ id: task.id, text: editText });
      setIsEditing(false);
    }
  };

  return (
    <li className="task-item flex justify-between bg-white p-4 rounded-md shadow-md mb-3">
      <button type="button" className="text-xl" onClick={() => onToggle(task.id)}>
        {task.completed ? "✅" : "⬜️"}
      </button>

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="flex flex-grow mx-4">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-grow border px-2 py-1 rounded mr-2"
            autoFocus
          />
          <button type="submit" className="text-green-600 mr-2">💾</button>
          <button type="button" onClick={() => setIsEditing(false)} className="text-red-500">❌</button>
        </form>
      ) : (
        <>
          <span
            className={`mx-4 flex-grow ${
              task.completed ? "line-through opacity-50 text-gray-500" : "text-gray-800"
            }`}
          >
            {task.text}
          </span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setIsEditing(true)} className="text-blue-500">
              ✏️
            </button>
            <button type="button" onClick={() => onDelete(task.id)} className="text-xl">
              🗑️
            </button>
          </div>
        </>
      )}
    </li>

    
  );
};

export default TaskItem;
