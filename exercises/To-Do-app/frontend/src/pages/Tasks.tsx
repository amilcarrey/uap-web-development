import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/auth';

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'completed';
  boardId: number;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await api.get(`/tasks/board/${boardId}`);
        setTasks(response.data.tasks);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar tareas');
      }
    };

    fetchTasks();
  }, [user, boardId, navigate]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/tasks', { title, description, boardId: Number(boardId) });
      setTasks([...tasks, response.data.task]);
      setTitle('');
      setDescription('');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear tarea');
    }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTaskId) return;

    try {
      const response = await api.put(`/tasks/${editTaskId}`, {
        title: editTitle,
        description: editDescription,
      });
      setTasks(tasks.map((task) => (task.id === editTaskId ? response.data.task : task)));
      setEditTaskId(null);
      setEditTitle('');
      setEditDescription('');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar tarea');
    }
  };

  const handleCompleteTask = async (taskId: number, status: 'pending' | 'completed') => {
    try {
      const response = await api.patch(`/tasks/${taskId}/complete`, { status });
      setTasks(tasks.map((task) => (task.id === taskId ? response.data.task : task)));
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar estado de tarea');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar tarea');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

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
        <h1>Tareas del Tablero</h1>
        <button className="btn-danger" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleCreateTask}>
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
        <button type="submit">Crear Tarea</button>
      </form>
      {editTaskId && (
        <form onSubmit={handleEditTask}>
          <h2>Editar Tarea</h2>
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
            <button type="button" className="btn-secondary" onClick={() => setEditTaskId(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
        >
          <option value="all">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="completed">Completadas</option>
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar tareas..."
        />
      </div>
      <div className="grid">
        {filteredTasks.map((task) => (
          <div key={task.id} className="card">
            <h2>{task.title}</h2>
            <p>{task.description || 'Sin descripción'}</p>
            <p>Estado: {task.status === 'pending' ? 'Pendiente' : 'Completada'}</p>
            <div className="card-buttons">
              <button
                className="btn-warning"
                onClick={() => {
                  setEditTaskId(task.id);
                  setEditTitle(task.title);
                  setEditDescription(task.description || '');
                }}
              >
                Editar
              </button>
              <button
                className="btn-primary"
                onClick={() => handleCompleteTask(task.id, task.status === 'pending' ? 'completed' : 'pending')}
              >
                {task.status === 'pending' ? 'Completar' : 'Desmarcar'}
              </button>
              <button className="btn-danger" onClick={() => handleDeleteTask(task.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;