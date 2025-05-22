import React from "react";
import { Task } from "../types/Task";

const TaskList: React.FC<{
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ tasks, onToggle, onDelete }) => (
  <ul className="list-none p-0 m-0">
    {tasks.map((task) => (
      <li
        key={task.id}
        className="flex justify-between items-center px-4 py-2 border-b border-gray-300"
      >
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />
          <span className={task.completed ? "line-through text-gray-500" : ""}>
            {task.text}
          </span>
        </label>
        <button
          className="text-red-600 font-bold"
          onClick={() => onDelete(task.id)}
        >
          ×
        </button>
      </li>
    ))}
  </ul>
);

export default TaskList;
