// src/components/NavTableros.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useBoards, useCreateBoard, useDeleteBoard } from '../hooks/useBoards';
import { toast } from 'react-toastify';

export default function NavTableros() {
  const navigate = useNavigate();
  const { boardId } = useParams(); // ID del tablero activo en la URL

  const { data: boards, isLoading } = useBoards();
  const createBoardMutation = useCreateBoard();
  const deleteBoardMutation = useDeleteBoard();

  const [newName, setNewName] = useState('');

  function handleCreateBoard(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    createBoardMutation.mutate(newName.trim(), {
      onSuccess: (created) => {
        navigate(`/board/${created.id}`);
      },
    });
    setNewName('');
  }

  function handleDelete(board) {
    if (window.confirm(`¿Eliminar tablero "${board.name}"?`)) {
      deleteBoardMutation.mutate(board.id, {
        onSuccess: () => {
          // Si borraste el tablero que estabas viendo, redirigimos a Home
          if (parseInt(boardId) === board.id) {
            navigate('/');
          }
        },
      });
    }
  }

  if (isLoading) return <p>Cargando tableros…</p>;

  return (
    <div className="flex flex-col items-center mb-4">
      {/** ——— Aquí mostramos la lista de tableros ——— */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {boards.map((b) => {
          const isActive = parseInt(boardId) === b.id;
          return (
            <div key={b.id} className="relative">
              <Link
                to={`/board/${b.id}`}
                className={`
                  px-3 py-1 rounded 
                  ${isActive 
                    ? 'bg-amber-300 text-white' 
                    : 'bg-amber-100 hover:bg-amber-200'
                  }
                `}
              >
                {b.name}
              </Link>
              {/** Botón para eliminar tablero */}
              <button
                onClick={() => handleDelete(b)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/** ——— Formulario para crear un nuevo tablero ——— */}
      <form onSubmit={handleCreateBoard} className="flex space-x-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nuevo tablero"
          className="border p-2 rounded-l focus:outline-none focus:ring"
        />
        <button
          type="submit"
          className="bg-amber-500 text-white px-4 rounded-r hover:bg-amber-600"
        >
          Agregar
        </button>
      </form>
    </div>
  );
}
