import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/auth';

interface Board {
  id: number;
  title: string;
  description: string | null;
  ownerId: number;
}

const Boards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editBoardId, setEditBoardId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [error, setError] = useState('');
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBoards = async () => {
      try {
        const response = await api.get('/boards');
        setBoards(response.data.boards);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar tableros');
      }
    };

    fetchBoards();
  }, [user, navigate]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/boards', { title, description });
      setBoards([...boards, response.data.board]);
      setTitle('');
      setDescription('');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear tablero');
    }
  };

  const handleEditBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBoardId) return;

    try {
      const response = await api.put(`/boards/${editBoardId}`, {
        title: editTitle,
        description: editDescription,
      });
      setBoards(boards.map((board) => (board.id === editBoardId ? response.data.board : board)));
      setEditBoardId(null);
      setEditTitle('');
      setEditDescription('');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar tablero');
    }
  };

  const handleDeleteBoard = async (boardId: number) => {
    try {
      await api.delete(`/boards/${boardId}`);
      setBoards(boards.filter((board) => board.id !== boardId));
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar tablero');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cerrar sesión');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Mis Tableros</h1>
        <button className="btn-danger" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleCreateBoard}>
        <div>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Descripción</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Crear Tablero</button>
      </form>
      {editBoardId && (
        <form onSubmit={handleEditBoard}>
          <h2>Editar Tablero</h2>
          <div>
            <label htmlFor="editTitle">Título</label>
            <input
              id="editTitle"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="editDescription">Descripción</label>
            <input
              id="editDescription"
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>
          <div className="card-buttons">
            <button type="submit">Guardar Cambios</button>
            <button type="button" className="btn-secondary" onClick={() => setEditBoardId(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
      <div className="grid">
        {boards.map((board) => (
          <div key={board.id} className="card">
            <h2>{board.title}</h2>
            <p>{board.description || 'Sin descripción'}</p>
            <div className="card-buttons">
              <button
                className="btn-warning"
                onClick={() => {
                  setEditBoardId(board.id);
                  setEditTitle(board.title);
                  setEditDescription(board.description || '');
                }}
              >
                Editar
              </button>
              <button className="btn-danger" onClick={() => handleDeleteBoard(board.id)}>
                Eliminar
              </button>
              <button className="btn-primary" onClick={() => navigate(`/boards/${board.id}/tasks`)}>
                Ver Tareas
              </button>
              <button className="btn-primary" onClick={() => navigate(`/boards/${board.id}/permissions`)}>
                Permisos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Boards;