import React, { useState, useEffect } from "react";
import { useAddTask } from "../hooks/tasks/useAddTask";
import { useUpdateTask } from "../hooks/tasks/useUpdateTask";
import { useUIStore } from "../store/useUIStore"; // For editingTaskId
import { useTasks } from "../hooks/tasks/useTasks"; // To find task being edited
import { NewTaskPayload, UpdateTaskPayload } from "../types/task"; // Import task types

interface TaskFormProps {
  boardId: number; // Selected board's ID
  disabled?: boolean; // To disable form if user doesn't have edit permission
}

export const TaskForm: React.FC<TaskFormProps> = ({ boardId, disabled = false }) => {
  const { data: tasksData } = useTasks(boardId); // Pass boardId to useTasks
  const addTaskMutation = useAddTask();
  const updateTaskMutation = useUpdateTask();

  const editingTaskId = useUIStore((s) => s.editingTaskId);
  const setEditingTaskId = useUIStore((s) => s.setEditingTaskId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [dueDate, setDueDate] = useState(""); // Store as YYYY-MM-DD string for input type="date"

  useEffect(() => {
    if (editingTaskId && tasksData?.tasks) {
      const taskToEdit = tasksData.tasks.find((t) => t.id === editingTaskId);
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || "");
        setStatus(taskToEdit.status);
        setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.split('T')[0] : ""); // Format for input[type="date"]
      }
    } else {
      // Reset form
      setTitle("");
      setDescription("");
      setStatus("todo");
      setDueDate("");
    }
  }, [editingTaskId, tasksData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (disabled) return;

    const commonTaskData = {
      title: title.trim(),
      description: description.trim() || null, // Send null if empty
      status,
      dueDate: dueDate || null, // Send null if empty
    };

    if (editingTaskId) {
      const taskData: UpdateTaskPayload = commonTaskData;
      updateTaskMutation.mutate({ boardId, taskId: editingTaskId, taskData });
      setEditingTaskId(null);
    } else {
      const taskData: NewTaskPayload = commonTaskData;
      addTaskMutation.mutate({ boardId, taskData });
    }
    // Reset form fields (already handled by useEffect when editingTaskId becomes null or on add)
    if (!editingTaskId) { // Explicitly reset for add new
        setTitle("");
        setDescription("");
        setStatus("todo");
        setDueDate("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg shadow">
      <input
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={disabled}
        required
      />
      <textarea
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        disabled={disabled}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="task-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="task-status"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            disabled={disabled}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label htmlFor="task-dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date (optional)</label>
          <input
            id="task-dueDate"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
      <div className="flex gap-3 items-center mt-2">
        <button
          type="submit"
          className={`bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={disabled || addTaskMutation.isPending || updateTaskMutation.isPending}
        >
          {editingTaskId ?
            (updateTaskMutation.isPending ? 'Saving...' : 'Save Task') :
            (addTaskMutation.isPending ? 'Adding...' : 'Add Task')
          }
        </button>
        {editingTaskId && (
          <button
            type="button"
            onClick={() => {
              setEditingTaskId(null); // Resets form via useEffect
            }}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            disabled={disabled}
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};