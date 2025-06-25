import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardsQuery } from '../hooks/useBoardsQuery';
import { useToast } from '../context/ToastContext';
import { shareBoard, getBoardUsers, removeBoardUser } from '../config/api';
import PageLayout from '../components/PageLayout';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import useAppStore from '../stores/appStore';

const Boards = () => {
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardCategory, setNewBoardCategory] = useState('Personal');
  const [filter, setFilter] = useState('all');
  const [shareModal, setShareModal] = useState({ open: false, boardName: '', boardUsers: [], activeTab: 'users' });
  const [shareForm, setShareForm] = useState({ username: '', role: 'viewer' });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { settings } = useAppStore();

  const {
    boardsQuery: { data: boards = [], isLoading, error },
    createBoardMutation,
    deleteBoardMutation
  } = useBoardsQuery();

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (newBoardName.trim()) {
      try {
        await createBoardMutation.mutateAsync(
          { name: newBoardName, category: newBoardCategory },
          {
            onSuccess: () => {
              addToast('Tablero creado exitosamente', 'success');
              setNewBoardName('');
            },
            onError: () => {
              addToast('Error al crear el tablero', 'error');
            }
          }
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteBoard = async (boardName) => {
    try {
      await deleteBoardMutation.mutateAsync(boardName, {
        onSuccess: () => {
          addToast('Tablero eliminado exitosamente', 'success');
        },
        onError: () => {
          addToast('Error al eliminar el tablero', 'error');
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const openShareModal = async (boardName) => {
    try {
      const users = await getBoardUsers(boardName);
      setShareModal({ open: true, boardName, boardUsers: users, activeTab: 'users' });
    } catch (error) {
      addToast('Error al cargar usuarios del tablero', 'error');
    }
  };

  const closeShareModal = () => {
    setShareModal({ open: false, boardName: '', boardUsers: [], activeTab: 'users' });
    setShareForm({ username: '', role: 'viewer' });
  };

  const handleShareBoard = async (e) => {
    e.preventDefault();
    if (!shareForm.username.trim()) return;

    try {
      await shareBoard(shareModal.boardName, shareForm.username, shareForm.role);
      addToast('Tablero compartido exitosamente', 'success');
      
      const users = await getBoardUsers(shareModal.boardName);
      setShareModal(prev => ({ ...prev, boardUsers: users }));
      setShareForm({ username: '', role: 'viewer' });
    } catch (error) {
      addToast('Error al compartir el tablero', 'error');
    }
  };

  const handleRemoveUser = async (username) => {
    try {
      await removeBoardUser(shareModal.boardName, username);
      addToast('Usuario removido exitosamente', 'success');
      
      const users = await getBoardUsers(shareModal.boardName);
      setShareModal(prev => ({ ...prev, boardUsers: users }));
    } catch (error) {
      addToast('Error al remover usuario', 'error');
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      owner: 'bg-purple-600',
      editor: 'bg-blue-600',
      viewer: 'bg-gray-600'
    };
    
    const roleLabels = {
      owner: 'Propietario',
      editor: 'Editor',
      viewer: 'Solo lectura'
    };

    return (
      <span className={`${roleColors[role]} text-white text-xs px-2 py-1 rounded-full`}>
        {roleLabels[role]}
      </span>
    );
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const boardsPerPage = 4;
  const filteredBoards = boards.filter(board => {
    const matchesCategory = filter === 'all' || board.category === filter;
    const matchesSearch = !searchTerm || board.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const totalPages = Math.max(1, Math.ceil(filteredBoards.length / boardsPerPage));
  const paginatedBoards = filteredBoards.slice((currentPage - 1) * boardsPerPage, currentPage * boardsPerPage);

  if (isLoading) {
    return (
      <PageLayout title="Mis Tableros">
        <div className="text-white text-xl text-center">Cargando tableros...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Tableros">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
          Error al cargar los tableros
        </div>
      )}

      <form onSubmit={handleCreateBoard} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Nuevo tablero..."
            className="flex-1 p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
          />
          <select
            value={newBoardCategory}
            onChange={(e) => setNewBoardCategory(e.target.value)}
            className="p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
          >
            <option value="Personal">Personal</option>
            <option value="Universidad">Universidad</option>
          </select>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Crear
          </button>
        </div>
      </form>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'all' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => handleFilterChange('Personal')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'Personal' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          Personal
        </button>
        <button
          onClick={() => handleFilterChange('Universidad')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'Universidad' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          Universidad
        </button>
      </div>

      <SearchInput
        initialValue={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Buscar tablero..."
        debounceDelay={150}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedBoards.map(board => (
          <div
            key={board.id}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/30"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{board.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/60 text-sm">{board.category}</span>
                  {getRoleBadge(board.role)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => openShareModal(board.name)}
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  Compartir
                </button>
                {board.role === 'owner' && (
                  <button
                    onClick={() => handleDeleteBoard(board.name)}
                    className="text-red-400 hover:text-red-300 transition-colors text-sm"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate(`/board/${board.name}`)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Ver Tareas
            </button>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal para compartir tablero */}
      {shareModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Compartir: {shareModal.boardName}
            </h3>
            {/* Tab de Usuarios */}
            <form onSubmit={handleShareBoard} className="mb-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={shareForm.username}
                  onChange={(e) => setShareForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Nombre de usuario"
                  className="flex-1 p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
                />
                <select
                  value={shareForm.role}
                  onChange={(e) => setShareForm(prev => ({ ...prev, role: e.target.value }))}
                  className="p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
                >
                  <option value="viewer">Solo lectura</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Compartir
              </button>
            </form>
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Usuarios con acceso:</h4>
              <div className="space-y-2">
                {shareModal.boardUsers.map(user => (
                  <div key={user.username} className="flex justify-between items-center bg-white/10 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{user.username}</span>
                      {getRoleBadge(user.role)}
                    </div>
                    {user.role !== 'owner' && (
                      <button
                        onClick={() => handleRemoveUser(user.username)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={closeShareModal}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Boards; 