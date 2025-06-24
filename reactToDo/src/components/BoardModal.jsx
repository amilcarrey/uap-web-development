import { useState } from 'react';
import { useClientStore } from '../stores/clientStore';

const BoardModal = () => {
  const { 
    modals, 
    closeBoardModal, 
    addBoard, 
    removeBoard,
    boards 
  } = useClientStore();
  const [newBoardName, setNewBoardName] = useState('');

  const handleAddBoard = () => {
    if (newBoardName.trim()) {
      addBoard({
        id: `board-${Date.now()}`,
        name: newBoardName,
        categories: [] // Sin categorías por defecto
      });
      setNewBoardName('');
      closeBoardModal();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddBoard();
    }
  };

  if (!modals.isBoardModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Manage Boards</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">New Board Name</label>
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded"
            placeholder="Enter board name"
            autoFocus
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={closeBoardModal}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAddBoard}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Board
          </button>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-2">Existing Boards</h4>
          <ul className="space-y-2">
            {boards.map((board) => (
              <li key={board.id} className="flex justify-between items-center">
                <span>{board.name}</span>
                <button
                  onClick={() => removeBoard(board.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BoardModal;