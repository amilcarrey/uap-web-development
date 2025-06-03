import React, { useState, useEffect } from "react";
import { useAddTask, useUpdateTask } from "../hooks/useTasks";
import { useClientStore } from "../store/clientStore";
import { Beer } from "lucide-react";
import GorgeousButton from "./GorgeousButton";

const TaskForm: React.FC = () => {
  const [text, setText] = useState("");
  const { activeTab, editingTask, setEditingTask } = useClientStore();
  const addTaskMutation = useAddTask();
  const updateTaskMutation = useUpdateTask();

  const isEditing = !!editingTask;

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
    } else {
      setText("");
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    if (isEditing) {
      updateTaskMutation.mutate(
        { id: editingTask.id, text: text.trim() },
        {
          onSuccess: () => {
            setEditingTask(null);
            setText("");
          },
        }
      );
    } else {
      addTaskMutation.mutate(
        { text: text.trim(), tab: activeTab },
        {
          onSuccess: () => setText(""),
        }
      );
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
    setText("");
  };

  const isLoading = addTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 bg-dark-wood">
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isEditing ? "Editar tarea..." : "Enter a new task..."}
            className="bg-amber-200 flex-grow p-2 rounded-md focus:outline-none"
            autoComplete="off"
            disabled={isLoading}
          />
          <div className="mx-2" />
          <GorgeousButton
            type="submit"
            disabled={isLoading || !text.trim()}
            variant="green"
          >
            {isLoading ? (
              "..."
            ) : isEditing ? (
              "Apply changes"
            ) : (
              <Beer className="inline-block w-5 h-5 mb-0.5" />
            )}
          </GorgeousButton>
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <GorgeousButton onClick={handleCancel} variant="red">
              Cancel changes
            </GorgeousButton>
          </div>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
