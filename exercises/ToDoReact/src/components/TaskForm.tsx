import React, { useState, useEffect } from "react";
import { useAddTask, useUpdateTask } from "../hooks/useTasks";
import { useClientStore } from "../store/clientStore";
import { useBoardByTabName } from "../hooks/useTabs";
import { useParams } from "@tanstack/react-router";
import { Beer } from "lucide-react";
import GorgeousButton from "./GorgeousButton";

const TaskForm: React.FC = () => {
  const [text, setText] = useState("");
  const { activeTab, editingTask, setEditingTask } = useClientStore();
  const addTaskMutation = useAddTask();
  const updateTaskMutation = useUpdateTask();

  // Get current board's permission level
  const { tabId } = useParams({ from: "/tab/$tabId" }) || { tabId: activeTab };
  const currentBoard = useBoardByTabName(tabId);
  const permissionLevel = currentBoard?.permission_level || "owner";

  // Permission checks
  const canEdit = permissionLevel === "owner" || permissionLevel === "editor";
  const isViewer = permissionLevel === "viewer";

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
      // Prevent editing if user doesn't have edit permissions
      if (!canEdit) {
        console.warn("User does not have permission to edit tasks");
        setEditingTask(null);
        setText("");
        return;
      }

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
      // All users can add tasks (including viewers)
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

  // Don't show edit form if user can't edit
  if (isEditing && !canEdit) {
    setEditingTask(null);
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full p-4 ${isViewer ? "bg-purple-950" : "bg-amber-950"}`}
    >
      <div className="flex flex-col gap-2">
        {isViewer && !isEditing && (
          <div className="text-sm text-purple-300 mb-2 bg-purple-900 p-2 rounded">
            You're viewing a shared board. You can add new tasks and mark them
            complete, but cannot edit or delete existing tasks.
          </div>
        )}
        <div className="flex w-full items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              isEditing
                ? "Edit task..."
                : isViewer
                ? "Add a new task to shared board..."
                : "Enter a new task..."
            }
            className={`flex-grow p-2 rounded-md focus:outline-none ${
              isViewer ? "bg-purple-200" : "bg-amber-200"
            }`}
            autoComplete="off"
            disabled={isLoading}
            ref={(input) => {
              if (!isEditing && input) input.focus();
            }}
          />
          <div className="mx-2" />
          <GorgeousButton
            type="submit"
            disabled={isLoading || !text.trim()}
            variant="green"
            className={isViewer ? "bg-purple-600 hover:bg-purple-700" : ""}
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
