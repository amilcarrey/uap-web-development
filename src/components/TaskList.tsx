// usado para renderizar y gestionar las tareas individuales

import React from "react";
import TaskItem from "./TaskItem";
import type { Task } from "../type";


type Props = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  uppercase?: boolean;
};

const TaskList: React.FC<Props> = ({ tasks, onToggle, onDelete, uppercase }) => (
  <ul className="list-none p-0">
    {tasks.map((task) => (
      <TaskItem
        key={task.id}
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
        uppercase={uppercase}
      />
    ))}
  </ul>
);


export default TaskList;
