import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBoards, useCreateBoard, useDeleteBoard } from '../hooks/useBoards';
import { 
  PlusIcon, 
  ViewColumnsIcon, 
  UsersIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateBoardModal from '../components/CreateBoardModal';

const Dashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const { data: boards, isLoading, error } = useBoards();
  const createBoardMutation = useCreateBoard();
  const deleteBoardMutation = useDeleteBoard();

  const handleCreateBoard = async (boardData) => {
    try {
      await createBoardMutation.mutateAsync(boardData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tablero?')) {
      try {
        await deleteBoardMutation.mutateAsync(boardId);
      } catch (error) {
        console.error('Error deleting board:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-600">Error: {error.message}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Tableros
              </h1>
              <p className="text-gray-600">Bienvenido, {user?.nombre}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nuevo Tablero
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {boards?.length === 0 ? (
          <div className="text-center py-12">
            <ViewColumnsIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No tienes tableros
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando un nuevo tablero para organizar tus tareas.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Crear Tablero
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boards?.map((board) => (
              <div
                key={board.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {board.nombre}
                      </h3>
                      {board.descripcion && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {board.descripcion}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {board.rol === 'propietario' && (
                        <>
                          <button
                            onClick={() => navigate(`/boards/${board.id}/edit`)}
                            className="text-gray-400 hover:text-indigo-600"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBoard(board.id)}
                            className="text-gray-400 hover:text-red-600"
                            disabled={deleteBoardMutation.isPending}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      <span>{board.rol}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/boards/${board.id}`)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Abrir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBoard}
        isLoading={createBoardMutation.isPending}
      />
    </div>
  );
};

export default Dashboard;
