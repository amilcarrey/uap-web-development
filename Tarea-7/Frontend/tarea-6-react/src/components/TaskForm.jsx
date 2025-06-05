// src/components/TaskForm.jsx
import React, { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} id="task-form">
      <label htmlFor="nueva-tarea"></label>
      <input
        type="text"
        id="nueva-tarea"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What do you want to add?"
      />
      <button type="submit">Agregar</button>
    </form>
  );
}