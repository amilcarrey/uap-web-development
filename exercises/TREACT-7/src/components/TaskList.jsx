// src/components/TaskList.jsx
import TaskItem from './TaskItem';
import React, { useState } from 'react';


export default function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <ul className="list-none p-0">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
