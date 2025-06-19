import React, { useRef } from "react";
import { useUpdateTask, useDeleteTask, type Task } from "../hooks/useTasks";
import { useClientStore } from "../store/clientStore";
import { useConfigStore } from "../store/configStore";
import { SquarePen, Trash } from "lucide-react";
import GorgeousButton from "./GorgeousButton";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { setEditingTask } = useClientStore();
  const { config } = useConfigStore();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleToggleComplete = () => {
    updateTaskMutation.mutate({
      id: task.id,
      completed: !task.completed,
    });
  };

  const handleEdit = () => {
    setEditingTask({ id: task.id, text: task.text });
  };

  const handleDelete = () => {
    dialogRef.current?.showModal();
  };

  const confirmDelete = () => {
    deleteTaskMutation.mutate(task.id);
    dialogRef.current?.close();
  };

  const cancelDelete = () => {
    dialogRef.current?.close();
  };

  // CLOSING DIALOG WHEN CLICKING OUTSIDE
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      dialogRef.current?.close();
    }
  };

  // CLOSING DIALOG WITH ESCAPE KEY
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") {
      dialogRef.current?.close();
    }
  };

  const isLoading =
    updateTaskMutation.isPending || deleteTaskMutation.isPending;

  return (
    <>
      <li className="flex items-center justify-between p-3 border-b border-amber-700 bg-amber-950 hover:bg-medium-wood transition-colors">
        <div className="flex items-center flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isLoading}
            className="w-5 h-5 mr-3 accent-amber-500"
          />
          <span
            className={`flex-1 ${
              task.completed ? "line-through text-amber-500" : "text-slate-100"
            }`}
          >
            {config.uppercaseDescriptions ? task.text.toUpperCase() : task.text}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            disabled={isLoading}
            className="text-amber-500 hover:text-amber-300 transition-colors"
            aria-label="Edit task"
          >
            <SquarePen className="h-5 w-5 mt-0.5" />
          </button>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-red-500 hover:text-red-300 transition-colors"
            aria-label="Delete task"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </li>

      {/*IRISH DIALOG*/}
      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        onKeyDown={handleKeyDown}
        className="irish-pub-dialog backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="bg-orange-950 border-4 border-amber-300 rounded-lg p-6 max-w-md shadow-2xl">
          {/* Header decorativo */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-amber-800/30 px-4 py-2 rounded-full border border-amber-400">
              <h2 className="text-lg font-bold text-amber-200">hey mate!</h2>
            </div>
          </div>

          {/*CONTENT*/}
          <div className="text-center mb-6">
            <p className="text-amber-100 mb-2">
              Sure you want to delete this task?
            </p>
            <div className="bg-amber-900/50 p-3 rounded border border-amber-600">
              <p className="text-amber-200 font-medium italic">"{task.text}"</p>
            </div>
            <p className="text-amber-300 text-sm mt-2">
              This action cannot be undone. Please confirm.
            </p>
          </div>

          {/*BUTTONS*/}
          <div className="flex gap-3 justify-center">
            <GorgeousButton onClick={cancelDelete}>Cancel</GorgeousButton>
            <GorgeousButton
              onClick={confirmDelete}
              disabled={deleteTaskMutation.isPending}
              variant="red"
            >
              {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
            </GorgeousButton>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default TaskItem;
