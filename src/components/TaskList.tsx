import React from "react";
import TaskItem from "./TaskItem";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type Props = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

const TaskList: React.FC<Props> = ({ tasks, onToggle, onDelete }) => (
  <ul className="list-none p-0">
    {tasks.map((task) => (
      <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
    ))}
  </ul>
);

export default TaskList;
