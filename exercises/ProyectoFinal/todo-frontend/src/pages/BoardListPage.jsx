// src/pages/BoardListPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function BoardListPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Carga los tableros donde tengo permiso
  useEffect(() => {
    api.get('/boards')
      .then(res => setBoards(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      });
  }, [logout, navigate]);

  // Crea un tablero nuevo
  const handleCreate = async () => {
    if (!newBoardName.trim()) return;
    try {
      const res = await api.post('/boards', { name: newBoardName });
      setBoards([res.data, ...boards]);
      setNewBoardName('');
      navigate(`/boards/${res.data.id}`);
    } catch {
      alert('Error al crear tablero');
    }
  };

  // Borrar sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Tableros</h1>
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* NUEVO TABLERO INLINE */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Nombre del nuevo tablero"
          className="flex-grow p-2 border border-gray-400 rounded focus:outline-none"
          value={newBoardName}
          onChange={e => setNewBoardName(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Nuevo
        </button>
      </div>

      {/* LISTADO DE TABLEROS */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {boards.length === 0 && (
          <li className="text-gray-500 col-span-full">No tienes tableros aún.</li>
        )}
        {boards.map(b => (
          <li key={b.id} className="border p-4 rounded hover:shadow bg-white">
            <Link
              to={`/boards/${b.id}`}
              className="text-lg font-medium text-blue-600 hover:underline"
            >
              {b.name}
            </Link>
            <p className="text-sm text-gray-500">Rol: {b.role || 'owner'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
