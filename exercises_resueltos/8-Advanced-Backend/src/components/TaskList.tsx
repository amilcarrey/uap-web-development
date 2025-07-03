import React from "react";
import { TaskItem } from "./TaskItem"; // Ensure TaskItem is also updated for new Task type
import { useTasks } from "../hooks/tasks/useTasks";
import { Pagination } from "./Pagination"; // Ensure Pagination is compatible

interface TaskListProps {
  boardId: number; // Selected board's ID
}

export const TaskList: React.FC<TaskListProps> = ({ boardId }) => {
  const { data: tasksResponse, isLoading, isError, error } = useTasks(boardId);

  if (isLoading) return <p className="text-center py-8 text-gray-600">Loading tasks...</p>;
  if (isError) return <p className="text-center py-8 text-red-600">Error loading tasks: {error?.message}</p>;
  if (!tasksResponse || tasksResponse.tasks.length === 0) {
    return <p className="text-center py-8 text-gray-500">No tasks found for this board.</p>;
  }

  return (
    <div className="mt-4">
      <ul className="space-y-3">
        {tasksResponse.tasks.map((task) => (
          // TaskItem will need boardId if actions (edit, delete) are initiated from it
          // and hooks need boardId for query invalidation.
          <TaskItem key={task.id} task={task} boardId={boardId} />
        ))}
      </ul>
      <Pagination
        currentPage={tasksResponse.currentPage}
        totalPages={tasksResponse.totalPages}
        totalItems={tasksResponse.totalTasks}
      />
    </div>
  );
};