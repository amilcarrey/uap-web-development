import React from "react";
import { useTasks } from "../hooks/useTasks";
import { useClientStore } from "../store/clientStore";
import TaskItem from "./TaskItem";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import Pagination from "./Pagination";

const TaskList: React.FC = () => {
  const { data, isLoading, error } = useTasks();
  const { setCurrentPage } = useClientStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error.message} />;
  }

  if (!data?.tasks?.length) {
    return (
      <div className="p-8 text-center text-amber-100">
        <p>No tasks found. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-amber-950">
      {/* Lista de tareas */}
      <div className="divide-y divide-amber-200/20">
        {data.tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      {/* Paginación */}
      <Pagination 
        pagination={data.pagination}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TaskList;