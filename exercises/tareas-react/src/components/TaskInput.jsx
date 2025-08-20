// src/components/TaskInput.jsx
import { useState } from 'react';

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleAddClick();
    }
  }

  return (
    <div className="flex mb-4">
      <input
        type="text"
        className="flex-1 p-2 border rounded-l focus:outline-none focus:ring"
        placeholder="Nueva tarea..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleAddClick}
        className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
      >
        Agregar
      </button>
    </div>
  );
}
