// frontend/src/components/TaskForm.jsx
import React, { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    await onAdd(trimmed);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl mx-auto mb-6">
      <input
        type="text"
        placeholder="Add a new task..."
        className="
          flex-grow 
          px-4 py-2 
          border border-gray-300 
          rounded-l-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
          bg-white text-gray-800 
          placeholder-gray-400
        "
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit(e);
        }}
      />
      <button
        type="submit"
        className="
          px-6 
          bg-blue-500 text-white font-semibold 
          rounded-r-lg 
          hover:bg-blue-600 
          transition
        "
      >
        Add
      </button>
    </form>
  );
}
