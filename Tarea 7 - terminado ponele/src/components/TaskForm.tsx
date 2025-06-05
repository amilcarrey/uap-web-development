// src/components/TaskForm.tsx
import { useEffect, useState } from "react";
import { useMatch } from "@tanstack/react-router";
import { useTaskStore } from "../store/taskStore";
import { useConfigStore } from "../store/configStore";
import { useAddTask } from "../hooks/useAddTask";
import { useUpdateTask } from "../hooks/useUpdateTask";

export default function TaskForm() {
  const {
    params: { boardId },
  } = useMatch({ from: "/boards/$boardId" }); 

  const {
    selectedTask,
    editingText,
    setEditingText,
    setSelectedTask,
  } = useTaskStore();

  const { uppercaseDescriptions } = useConfigStore();
  const isEditing = !!selectedTask;
  const [text, setText] = useState(editingText);

  const addTask = useAddTask(boardId);
  const editTask = useUpdateTask();

  useEffect(() => {
    setText(editingText);
  }, [editingText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const finalText = uppercaseDescriptions ? trimmed.toUpperCase() : trimmed;

    if (isEditing && selectedTask) {
      editTask.mutate({ id: String(selectedTask.id), text: finalText, boardId });
      setSelectedTask(null);
    } else {
      addTask.mutate({ text: finalText, boardId });
    }

    setText("");
    setEditingText("");
  };

  const handleCancel = () => {
    setText("");
    setEditingText("");
    setSelectedTask(null);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setEditingText(e.target.value);
        }}
        placeholder="Escribe una tarea"
        className="border rounded px-2 py-1 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
        {isEditing ? "Guardar" : "Agregar"}
      </button>
      {isEditing && (
        <button type="button" onClick={handleCancel} className="text-sm text-gray-600">
          Cancelar
        </button>
      )}
    </form>
  );
}
