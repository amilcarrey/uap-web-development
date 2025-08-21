import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useBoardStore } from '../../store/useBoardStore';
import * as authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { toastError, toastSuccess } from '../../lib/toast';
import BoardList from '../board/BoardList';
import BoardView from '../board/BoardView';
import { LogOut, Settings } from 'lucide-react'; // Added Settings icon
import { Link } from 'react-router-dom'; // For navigation

const DashboardPage: React.FC = () => {
  const { user, logout: authLogoutAction } = useAuthStore();
  const { fetchBoards: fetchBoardStoreBoards, selectedBoard } = useBoardStore(); // Renamed to avoid conflict
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial boards when the dashboard mounts
    // This is already handled in BoardList, but can be called here too if needed for other reasons
    // fetchBoardStoreBoards();
  }, [fetchBoardStoreBoards]);


  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      authLogoutAction();
      toastSuccess('Logged out successfully.');
      navigate('/login');
    } catch (error: any) {
      toastError(error.message || 'Logout failed.');
      authLogoutAction(); // Ensure client-side logout even if API fails
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            Task Manager Pro
          </h1>
          <div className="flex items-center space-x-4">
            {user && <span className="text-gray-700">Hi, {user.username}!</span>}
            <Link to="/settings" className="p-2 text-gray-600 hover:text-blue-600" title="Settings">
              <Settings size={20} />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden container mx-auto mt-4 mb-4 space-x-4">
        {/* Sidebar for Boards */}
        <aside className="w-1/4 min-w-[250px] max-w-[300px] bg-gray-50 p-0 rounded-lg shadow-lg overflow-y-auto">
          <BoardList />
        </aside>

        {/* Main view for selected board's tasks */}
        <main className="flex-1 bg-gray-50 rounded-lg shadow-lg overflow-y-auto">
          {selectedBoard ? (
            <BoardView />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-lg">
              <p>Select a board from the list, or create a new one to get started.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
