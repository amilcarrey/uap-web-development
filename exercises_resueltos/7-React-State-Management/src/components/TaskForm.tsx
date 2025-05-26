import { useState, useEffect } from "react";
import { useAddTask } from "../hooks/tasks/useAddTask";
import { useUpdateTask } from "../hooks/tasks/useUpdateTask";
import { useUIStore } from "../store/useUIStore";
import { useTasks } from "../hooks/tasks/useTasks";

export const TaskForm = () => {
  const { data } = useTasks();
  const addTask = useAddTask();
  const updateTask = useUpdateTask();

  const editingTaskId = useUIStore((s) => s.editingTaskId);
  const setEditingTaskId = useUIStore((s) => s.setEditingTaskId);

  const [text, setText] = useState("");

  useEffect(() => {
    if (editingTaskId && data) {
      const task = data.tasks.find((t) => t.id === editingTaskId);
      setText(task?.text ?? "");
    }
  }, [editingTaskId, data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editingTaskId) {
      updateTask.mutate({ id: editingTaskId, text: text.trim(), completed: false });
      setEditingTaskId(null);
    } else {
      addTask.mutate(text.trim());
    }
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none"
        type="text"
        placeholder="¿Qué tarea necesitas agregar?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
      >
        {editingTaskId ? "Save" : "Add"}
      </button>
      {editingTaskId && (
        <button
          type="button"
          onClick={() => {
            setEditingTaskId(null);
            setText("");
          }}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
      )}
    </form>
  );
};