// src/components/BoardList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoards, useAddBoard, useDeleteBoard } from '../hooks/useBoards';
import { useToastStore } from '../stores/toastStore';

export default function BoardList() {
  const { data: boards, isLoading, isError, error } = useBoards();
  const addBoardMutation = useAddBoard();
  const deleteBoardMutation = useDeleteBoard();
  const addToast = useToastStore((state) => state.addToast);

  const [newName, setNewName] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await addBoardMutation.mutateAsync({ name: newName.trim() });
      addToast({ message: 'Tablero creado', type: 'success' });
      setNewName('');
    } catch (err) {
      addToast({ message: err.message, type: 'error' });
    }
  };

  return (
    <div className="p-8 bg-amber-50 min-h-screen">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Mis Tableros</h1>

        {/* Formulario para crear un nuevo tablero */}
        <div className="flex mb-6">
          <input
            type="text"
            placeholder="Nombre del tablero"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 border p-2 rounded-l focus:outline-none"
          />
          <button
            onClick={handleCreate}
            className="bg-amber-500 text-white px-4 rounded-r hover:bg-amber-600"
          >
            Crear
          </button>
        </div>

        {/* Estados de loading / error */}
        {isLoading && <p className="text-center">Cargando tableros...</p>}
        {isError && <p className="text-center text-red-500">{error.message}</p>}

        {/* Listado de tableros */}
        {!isLoading && !isError && (
          <ul className="space-y-2">
            {boards.map((b) => (
              <li key={b.id} className="flex justify-between items-center bg-amber-100 p-3 rounded shadow-sm">
                <Link to={`/boards/${b.id}`} className="text-lg font-medium">
                  {b.name}
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await deleteBoardMutation.mutateAsync(b.id);
                      addToast({ message: 'Tablero eliminado', type: 'success' });
                    } catch (err) {
                      addToast({ message: err.message, type: 'error' });
                    }
                  }}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
