// src/pages/BoardDetailPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';

export default function BoardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { prefs } = useContext(SettingsContext);

  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [targetUser, setTargetUser] = useState('');
  const [targetRole, setTargetRole] = useState('editor');

  // Carga detalle del tablero
  const fetchBoard = () =>
    api.get(`/boards/${id}`)
      .then(res => setBoard(res.data))
      .catch(err => {
        if (err.response?.status === 403) alert('Sin permiso');
        if (err.response?.status === 401) { logout(); navigate('/login'); }
      });

  // Carga tareas según filtros/paginación
  const fetchTasks = () => {
    const params = { page, limit };
    if (statusFilter !== 'all') params.status = statusFilter;
    if (searchQ) params.search = searchQ;
    api.get(`/boards/${id}/tasks`, { params })
      .then(res => setTasks(res.data))
      .catch(() => {});
  };

  // Auto-refresh según prefs
  useEffect(() => {
    fetchBoard();
    fetchTasks();
    let timer;
    if (prefs.refreshInterval > 0) {
      timer = setInterval(fetchTasks, prefs.refreshInterval * 1000);
    }
    return () => clearInterval(timer);
  }, [id, page, statusFilter, searchQ, prefs.refreshInterval]);

  // Eliminar tareas completadas
  const handleBatchDelete = async () => {
    try {
      await api.delete(`/boards/${id}/tasks/completed`);
      fetchTasks();
    } catch {
      alert('Error al eliminar tareas completadas');
    }
  };

  // Compartir tablero
  const handleShare = async e => {
    e.preventDefault();
    if (!targetUser.trim()) {
      alert('Ingresa un User ID para compartir');
      return;
    }
    try {
      await api.post(`/boards/${id}/share`, {
        userId: targetUser,
        role:   targetRole
      });
      alert('Tablero compartido con éxito');
      setTargetUser('');
    } catch {
      alert('Error al compartir tablero');
    }
  };

  if (!board) return <p className="p-4">Cargando...</p>;

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Tablero: {board.name}</h2>
        <Link to="/settings" className="text-blue-600 hover:underline">
          Configuraciones
        </Link>
      </header>

      {/* CREAR TAREA */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Nueva tarea..."
          className="flex-grow p-3 border border-gray-400 rounded focus:outline-none"
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
        />
        <button
          onClick={async () => {
            if (!newTaskText.trim()) return;
            try {
              const res = await api.post(`/boards/${id}/tasks`, { content: newTaskText });
              setTasks([res.data, ...tasks]);
              setNewTaskText('');
            } catch {
              alert('Error al crear tarea');
            }
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded"
        >
          Agregar
        </button>
      </div>

      {/* BUSCAR / FILTRAR */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Buscar tarea..."
          className="flex-grow p-2 border border-gray-300 rounded focus:outline-none"
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
        />
        <button
          onClick={() => { setPage(1); fetchTasks(); }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {/* BOTONES DE FILTRO */}
      <div className="flex gap-2 mb-4">
        {['all','pending','done'].map(f => (
          <button
            key={f}
            onClick={() => { setStatusFilter(f); setPage(1); }}
            className={`px-4 py-2 rounded ${
              statusFilter === f
                ? 'bg-yellow-400 text-white'
                : 'bg-yellow-200 text-gray-700 hover:bg-yellow-300'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'pending' ? 'Activas' : 'Completadas'}
          </button>
        ))}
      </div>

      {/* LISTA DE TAREAS */}
      <ul className="space-y-2">
        {tasks.length === 0 && (
          <li className="text-gray-500 text-center py-4">Sin tareas</li>
        )}
        {tasks.map(task => (
          <li
            key={task.id}
            className="flex items-center justify-between bg-yellow-100 p-3 rounded hover:bg-yellow-200"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.status === 'done'}
                onChange={async () => {
                  const newStatus = task.status === 'pending' ? 'done' : 'pending';
                  try {
                    await api.put(`/boards/${id}/tasks/${task.id}`, { status: newStatus });
                    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
                  } catch {
                    alert('Error al actualizar estado');
                  }
                }}
                className="w-5 h-5 text-green-500"
              />
              <span className={task.status === 'done' ? 'line-through text-gray-500' : ''}>
                {task.content}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  const newText = prompt('Editar tarea', task.content);
                  if (!newText) return;
                  try {
                    const res = await api.put(`/boards/${id}/tasks/${task.id}`, { content: newText });
                    setTasks(tasks.map(t => t.id === task.id ? res.data : t));
                  } catch {
                    alert('Error al editar tarea');
                  }
                }}
                className="text-blue-500 hover:text-blue-600"
              >
                ✎
              </button>
              <button
                onClick={async () => {
                  try {
                    await api.delete(`/boards/${id}/tasks/${task.id}`);
                    setTasks(tasks.filter(t => t.id !== task.id));
                  } catch {
                    alert('Error al eliminar tarea');
                  }
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* PAGINACIÓN */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage(p => Math.max(p-1,1))}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Anterior
        </button>
        <span>Página {page}</span>
        <button
          onClick={() => setPage(p => p+1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Siguiente
        </button>
      </div>

      {/* BORRAR COMPLETADAS */}
      <div className="mt-6 text-center">
        <button
          onClick={handleBatchDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded"
        >
          Limpiar Completadas!!
        </button>
      </div>

      {/* COMPARTIR TABLERO */}
      <form onSubmit={handleShare} className="mt-8 bg-yellow-100 p-4 rounded">
        <h3 className="mb-2 font-semibold text-gray-800">Compartir tablero</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="User ID"
            value={targetUser}
            onChange={e => setTargetUser(e.target.value)}
            className="flex-grow p-2 border border-gray-400 rounded focus:outline-none"
          />
          <select
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            className="p-2 border border-gray-400 rounded focus:outline-none"
          >
            <option value="editor">Editor</option>
            <option value="reader">Solo lectura</option>
          </select>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Compartir
          </button>
        </div>
      </form>
    </div>
  );
}
