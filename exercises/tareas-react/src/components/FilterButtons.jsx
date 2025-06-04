// src/components/FilterButtons.jsx
import React, { useState } from 'react';


export default function FilterButtons({ filter, onChangeFilter }) {
  return (
    <div className="mb-4 flex justify-center">
      <button
        onClick={() => onChangeFilter('all')}
        disabled={filter === 'all'}
        className={`mr-2 px-3 py-1 rounded ${
          filter === 'all' ? 'bg-amber-300' : 'bg-amber-100 hover:bg-amber-200'
        }`}
      >
        Todas
      </button>
      <button
        onClick={() => onChangeFilter('active')}
        disabled={filter === 'active'}
        className={`mr-2 px-3 py-1 rounded ${
          filter === 'active' ? 'bg-amber-300' : 'bg-amber-100 hover:bg-amber-200'
        }`}
      >
        Activas
      </button>
      <button
        onClick={() => onChangeFilter('completed')}
        disabled={filter === 'completed'}
        className={`px-3 py-1 rounded ${
          filter === 'completed' ? 'bg-amber-300' : 'bg-amber-100 hover:bg-amber-200'
        }`}
      >
        Completadas
      </button>
    </div>
  );
}
