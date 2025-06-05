// src/components/TopBar.tsx
import React from 'react';
import { useBoardStore } from '../store/boardStore';

const TopBar: React.FC = () => {
  const { boards, currentBoard, setBoard, addBoard } = useBoardStore();

  return (
    <div className="w-full py-2 text-center bg-blanchedalmond flex justify-around text-[20px]">
      <div className="flex gap-2">
        {boards.map((board) => (
          <button
            key={board}
            onClick={() => setBoard(board)}
            className={`font-bold px-4 py-2 ${
              board === currentBoard ? 'border-b-4 border-orange-500' : ''
            }`}
          >
            {board}
          </button>
        ))}
        <button onClick={addBoard} className="font-bold px-4 py-2">+</button>
      </div>
    </div>
  );
};

export default TopBar;
