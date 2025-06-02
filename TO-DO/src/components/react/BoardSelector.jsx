import React, { useState } from 'react';

const BoardSelector = ({ boards, selectedBoard, onCreateBoard, onSelectBoard }) => {
  const [newBoard, setNewBoard] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (newBoard.trim()) {
      onCreateBoard(newBoard.trim());
      setNewBoard('');
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newBoard}
          onChange={e => setNewBoard(e.target.value)}
          placeholder="Nuevo tablero..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Crear
        </button>
      </form>
      <select
        value={selectedBoard}
        onChange={e => onSelectBoard(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {boards.length === 0 && <option value="">Sin tableros</option>}
        {boards.map(board => (
          <option key={board.id} value={board.id}>{board.name}</option>
        ))}
      </select>
    </div>
  );
};

export default BoardSelector; 