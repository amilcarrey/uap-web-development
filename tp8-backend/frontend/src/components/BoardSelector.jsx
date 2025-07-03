// src/components/BoardSelector.jsx
import React, { useState } from 'react';
import { useBoardsStore } from '../store/useBoardsStore';

export default function BoardSelector() {
  const { boards, current, setCurrent, addBoard, deleteBoard } = useBoardsStore();
  const [newBoardName, setNewBoardName] = useState('');

  const handleCreate = () => {
    const name = newBoardName.trim();
    if (name) {
      addBoard(name);
      setNewBoardName('');
    }
  };

  return (
    <div className="board-selector">
      <h2>Tablero actual: {boards.find(b => b.id === current)?.name}</h2>

      <select value={current} onChange={(e) => setCurrent(e.target.value)}>
        {boards.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <div className="board-actions">
        <input
          type="text"
          placeholder="Nuevo tablero"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
        />
        <button onClick={handleCreate}>Crear</button>
        {current !== 'default' && (
          <button onClick={() => deleteBoard(current)}>Eliminar</button>
        )}
      </div>
    </div>
  );
}
