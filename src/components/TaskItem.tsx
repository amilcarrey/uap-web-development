import React from "react";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

const TaskItem: React.FC<Props> = ({ task, onToggle, onDelete }) => (
  <li className="task-item flex justify-between bg-white p-4 rounded-md shadow-md mb-3">
    <button type="button" className="text-xl" onClick={() => onToggle(task.id)}>
      {task.completed ? "✅" : "⬜️"}
    </button>
    <span
      className={`mx-4 flex-grow ${
        task.completed ? "line-through opacity-50 text-gray-500" : "text-gray-800"
      }`}
    >
      {task.text}
    </span>
    <button type="button" onClick={() => onDelete(task.id)} className="text-xl">
      🗑️
    </button>
  </li>
);

export default TaskItem;
