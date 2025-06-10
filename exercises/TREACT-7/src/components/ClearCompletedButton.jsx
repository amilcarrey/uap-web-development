// src/components/ClearCompletedButton.jsx
import React from 'react';

export default function ClearCompletedButton({ onClear }) {
  return (
    <div className="mt-4 flex justify-center">
      <button
        onClick={onClear}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Limpiar Completadas
      </button>
    </div>
  );
}
