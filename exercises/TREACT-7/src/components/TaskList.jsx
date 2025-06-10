// src/components/TaskList.jsx
import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggle, onDelete, boardId }) {
  return (
    <ul className="list-none p-0">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={{ ...task, boardId }}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
