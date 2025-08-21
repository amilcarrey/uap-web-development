import React from 'react';
import type { Task, TaskStatus } from "../types/task"; // Updated Task type
import { useDeleteTask } from "../hooks/tasks/useDeleteTask";
import { useUpdateTask } from "../hooks/tasks/useUpdateTask";
import { useUIStore } from "../store/useUIStore";
import { useAuthStore } from '../store/useAuthStore'; // To get current user for permission checks
import { useBoardStore, getCurrentUserPermissionLevelForBoard, checkOwnership } from '../store/useBoardStore'; // For board permissions
import { Edit2, Trash2, CheckCircle, Circle, Zap } from 'lucide-react'; // Icons

interface TaskItemProps {
  task: Task;
  boardId: number; // Needed for actions
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, boardId }) => {
  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();
  const setEditingTaskId = useUIStore((s) => s.setEditingTaskId);

  const { selectedBoard, selectedBoardPermissions } = useBoardStore();
  const currentUser = useAuthStore((state) => state.user);

  const currentUserPermission = getCurrentUserPermissionLevelForBoard(selectedBoardPermissions, currentUser?.id);
  const isBoardOwner = checkOwnership(selectedBoard, currentUser?.id);
  const canEditTasks = currentUserPermission === 'owner' || currentUserPermission === 'editor';


  const handleToggleStatus = () => {
    if (!canEditTasks) return;
    let newStatus: TaskStatus;
    if (task.status === 'done') {
      newStatus = 'todo'; // Cycle back to 'todo'
    } else if (task.status === 'todo') {
      newStatus = 'in-progress';
    } else { // 'in-progress'
      newStatus = 'done';
    }
    updateTaskMutation.mutate({
      boardId,
      taskId: task.id,
      taskData: { ...task, status: newStatus }
    });
  };

  const handleEdit = () => {
    if (!canEditTasks) return;
    setEditingTaskId(task.id);
  };

  const handleDelete = () => {
    if (!canEditTasks) return;
    if (window.confirm(`Are you sure you want to delete task: "${task.title}"?`)) {
      deleteTaskMutation.mutate({ boardId, taskId: task.id });
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch(status) {
      case 'todo': return <Circle className="w-5 h-5 text-gray-400 hover:text-yellow-500 cursor-pointer" />;
      case 'in-progress': return <Zap className="w-5 h-5 text-yellow-500 hover:text-green-500 cursor-pointer" />;
      case 'done': return <CheckCircle className="w-5 h-5 text-green-500 hover:text-gray-400 cursor-pointer" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  }

  return (
    <li className="flex items-center justify-between p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button onClick={handleToggleStatus} disabled={!canEditTasks} title={`Click to change status (current: ${task.status})`}>
            {getStatusIcon(task.status)}
        </button>
        <div className="flex-1 min-w-0">
          <span
            className={`block font-medium truncate ${task.status === 'done' ? "line-through text-gray-400" : "text-gray-800"}`}
            title={task.title}
          >
            {task.title}
          </span>
          {task.description && (
            <p className="text-xs text-gray-500 truncate" title={task.description}>{task.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm ml-2">
        {task.dueDate && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
        )}
        {canEditTasks && (
          <>
            <button
              onClick={handleEdit}
              className="p-1 text-blue-600 hover:text-blue-800"
              title="Edit Task"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-red-500 hover:text-red-700"
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </li>
  );
};