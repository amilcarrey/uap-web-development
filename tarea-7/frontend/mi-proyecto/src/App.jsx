import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useBoards, useCreateBoard, useDeleteBoard } from './hooks/useTasks';
import NotificationToast from './components/NotificationToast';
import useNotificationStore from './store/notificationStore';
import BoardView from './components/BoardView';
import SettingsPage from './components/SettingsPage'; // Importa el nuevo componente

function App() {
  const { data: boards, isLoading: isLoadingBoards, isError: isErrorBoards, error: boardsError } = useBoards();
  const createBoardMutation = useCreateBoard();
  const deleteBoardMutation = useDeleteBoard();

  const showNotification = useNotificationStore((state) => state.showNotification);

  const queryClient = useQueryClient();

  const handleCreateBoard = () => {
    const boardName = prompt("Enter new board name:");
    if (boardName && boardName.trim() !== '') {
      createBoardMutation.mutate(boardName, {
        onSuccess: (data) => {
          showNotification(`Board '${data.board.name}' created!`, 'success');
        },
        onError: (err) => {
          showNotification(`Error creating board: ${err.message}`, 'error');
        },
      });
    } else {
      showNotification('Board name cannot be empty.', 'warning');
    }
  };

  const handleDeleteBoard = (boardId) => {
    if (window.confirm("Are you sure you want to delete this board and all its tasks?")) {
      deleteBoardMutation.mutate(boardId, {
        onSuccess: () => {
          showNotification('Board deleted!', 'success');
          queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
        },
        onError: (err) => {
          showNotification(`Error deleting board: ${err.message}`, 'error');
        },
      });
    }
  };

  const defaultBoardId = boards && boards.length > 0 ? boards[0].id : null;

  return (
    <Router>
      <div className="font-sans bg-gray-100 min-h-screen overflow-y-auto">
        <header className="text-center py-2">
          <h1 className="text-[25px] bg-gradient-to-r from-cyan-400 to-blue-700 bg-clip-text text-transparent w-fit mx-auto">TODO</h1>
        </header>
        <main className="container mx-auto px-4">
          <section className="flex flex-wrap items-center justify-center gap-2 my-4 p-2 bg-gray-200 rounded-md shadow-sm">
            <h2 className="text-xl font-bold text-gray-700 mr-4">Boards:</h2>
            {isLoadingBoards ? (
              <p>Loading boards...</p>
            ) : isErrorBoards ? (
              <p className="text-red-500">Error: {boardsError.message}</p>
            ) : boards.length === 0 ? (
              <p className="text-gray-500">No boards. Create one!</p>
            ) : (
              boards.map((board) => (
                <div key={board.id} className="flex items-center gap-1">
                  <Link
                    to={`/boards/${board.id}`}
                    className="px-3 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-700 transition duration-200 text-sm"
                  >
                    {board.name}
                  </Link>
                  <button
                    onClick={() => handleDeleteBoard(board.id)}
                    className="text-red-500 hover:text-red-700 text-xl font-bold leading-none p-0.5 rounded-full"
                    title="Delete Board"
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
            <button
              onClick={handleCreateBoard}
              className="px-3 py-1 rounded-full bg-green-500 text-white hover:bg-green-700 transition duration-200 text-sm"
            >
              + Add Board
            </button>
            <Link
                to="/settings"
                className="ml-4 px-3 py-1 rounded-full bg-purple-500 text-white hover:bg-purple-700 transition duration-200 text-sm"
            >
                Settings
            </Link>
          </section>

          <Routes>
            {defaultBoardId && (
              <Route path="/" element={<Navigate to={`/boards/${defaultBoardId}`} replace />} />
            )}
            <Route path="/boards/:boardId" element={<BoardView />} />
            <Route path="/settings" element={<SettingsPage />} />
            {!defaultBoardId && (
                <Route path="/" element={
                    <div className="text-center text-gray-600 mt-10">
                        No boards available. Please create a new board to start.
                    </div>
                } />
            )}
            <Route path="*" element={<Navigate to={defaultBoardId ? `/boards/${defaultBoardId}` : "/"} replace />} />
          </Routes>
        </main>
        <NotificationToast />
      </div>
    </Router>
  );
}

export default App;