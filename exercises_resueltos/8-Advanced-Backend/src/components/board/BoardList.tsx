import React, { useEffect, useState } from 'react';
import { useBoardStore } from '../../store/useBoardStore';
import CreateBoardModal from './CreateBoardModal';
import { PlusCircle } from 'lucide-react'; // Assuming lucide-react for icons

const BoardList: React.FC = () => {
  const { boards, selectedBoard, fetchBoards, selectBoard, isLoading } = useBoardStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleSelectBoard = (boardId: number) => {
    selectBoard(boardId);
  };

  if (isLoading && boards.length === 0) { // Show loading only on initial fetch
    return <div className="p-4 text-center text-gray-500">Loading boards...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-700">My Boards</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="p-2 text-blue-600 hover:text-blue-800"
          title="Create new board"
        >
          <PlusCircle size={24} />
        </button>
      </div>
      {boards.length === 0 && !isLoading ? (
        <p className="text-center text-gray-500 py-4">No boards yet. Create one to get started!</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {boards.map((board) => (
            <li key={board.id}>
              <button
                onClick={() => handleSelectBoard(board.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors duration-150
                  ${selectedBoard?.id === board.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
                  }`}
              >
                {board.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <CreateBoardModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};

export default BoardList;
