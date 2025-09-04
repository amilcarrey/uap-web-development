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

const TaskItem: React.FC<Props> = ({ task, onToggle, onDelete }) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
        {task.text}
      </span>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
};

export default TaskItem;
