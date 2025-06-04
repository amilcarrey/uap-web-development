import type { Task } from "../types/Task";
import { useToggleTask, useDeleteTask, useEditTask } from "../hooks/useTasks";
import { useState } from "react";
import { useSettingsStore } from '../store/useSettingsStore';


interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const toogleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const editTask = useEditTask();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const upperCaseDescription = useSettingsStore((state) => state.upperCaseDescription);
  const displayText = upperCaseDescription ? task.text.toUpperCase() : task.text;


  const handleToggle = async () => {
    setIsToggling(true);
    toogleTask.mutate(
      {
        id: task.id,
        completed: !task.completed,
      },
      {
        onSettled: () => setIsToggling(false),
      }
    );
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    deleteTask.mutate(task.id, {
      onSettled: () => setIsDeleting(false),
    });
  };

  const handleEdit = async () => {
    setIsEditing(true);
    setEditText(task.text);
  };
  const handleSaveEdit = async () => {
    if (editText.trim() === task.text) {
      setIsEditing(false);
      return;
    }
    editTask.mutate(
      { id: task.id, text: editText.trim() },
      {
        onSettled: () => setIsEditing(false),
      }
    );
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(task.text);
  };

  return (
    <li className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="mr-2"
          disabled={isEditing}
        />
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 px-2 py-1 border rounded"
            autoFocus
          />
        ) : (
          <span className={task.completed ? "line-through text-gray-500" : ""}>
            {displayText}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="text-green-500 hover:text-green-700"
              disabled={editTask.isPending}
            >
              {editTask.isPending ? "⌛" : "✔️"}
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              ❌
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="text-blue-500 hover:text-blue-700"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "⌛" : "🗑️"}
            </button>
          </>
        )}
      </div>
    </li>
  );
};
