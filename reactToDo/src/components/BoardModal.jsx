import { useState } from 'react';
import { useBoards, useCreateBoard, useDeleteBoard } from '../hooks/useBoards';

const BoardModal = ({ onClose, setActiveBoard }) => {
  const [newBoardName, setNewBoardName] = useState('');
  const { data: boards = [] } = useBoards();
  const createBoard = useCreateBoard();
  const deleteBoard = useDeleteBoard();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newBoardName.trim()) {
      createBoard.mutate(newBoardName, {
        onSuccess: (board) => {
          setNewBoardName('');
          setActiveBoard && setActiveBoard(board.id); // Esto ahora sí funcionará
          onClose && onClose();
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Manage Boards</h3>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">New Board Name</label>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter board name"
              autoFocus
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose ? onClose : undefined}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              disabled={!onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Board
            </button>
          </div>
        </form>
        <div className="mt-6">
          <h4 className="font-medium mb-2">Existing Boards</h4>
          <ul className="space-y-2">
            {boards.map((board) => (
              <li key={board.id} className="flex justify-between items-center">
                <span>{board.name}</span>
                <button
                  onClick={() => deleteBoard.mutate(board.id)}
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