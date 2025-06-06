// frontend/src/components/TaskList.jsx
import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  currentFilter,
  onToggle,
  onDelete,
  onEdit,
  onClearCompleted
}) {
  const filtered = tasks.filter((t) => {
    if (currentFilter === 'Active') return !t.completed;
    if (currentFilter === 'Completed') return t.completed;
    return true; // 'All'
  });

  return (
    <div className="max-w-xl mx-auto">
      {filtered.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}

      {tasks.some((t) => t.completed) && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onClearCompleted}
            className="
              px-6 py-2 
              bg-red-500 text-white font-semibold 
              rounded-full shadow hover:bg-red-600 transition
            "
          >
            Clear Completed
          </button>
        </div>
      )}
    </div>
  );
}
