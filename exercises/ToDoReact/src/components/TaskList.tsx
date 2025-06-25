import React from "react";
import { useSearch } from "@tanstack/react-router";
import { useTasks } from "../hooks/useTasks";
import { useClientStore } from "../store/clientStore";
import TaskItem from "./TaskItem";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import Pagination from "./Pagination";

const TaskList: React.FC = () => {
  const search = useSearch({ from: "/tab/$tabId" });
  const { data, isLoading, error } = useTasks(search.search);
  const { setCurrentPage } = useClientStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error.message} />;
  }

  if (!data?.tasks?.length) {
    const searchTerm = search.search;
    return (
      <div className="p-8 text-center text-amber-100">
        {searchTerm ? (
          <div>
            <p>No tasks found matching "{searchTerm}"</p>
            <p className="text-sm text-amber-300 mt-2">
              Try a different search term or clear the search.
            </p>
          </div>
        ) : (
          <p>No tasks found. Add one above!</p>
        )}
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
      <Pagination pagination={data.pagination} onPageChange={setCurrentPage} />
    </div>
  );
};

export default TaskList;
