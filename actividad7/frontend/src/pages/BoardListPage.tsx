import { Link } from 'react-router-dom';
import { useBoards } from '../hooks/useBoards';
import { useState } from 'react';

const BoardListPage = () => {
  const [newBoardName, setNewBoardName] = useState('');
  const { boards, isLoading, error, createBoard, deleteBoard } = useBoards();

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard(newBoardName.trim());
      setNewBoardName('');
    }
  };

  if (isLoading) return <div>Cargando tableros...</div>;
  if (error) return <div>Error al cargar tableros: {error.message}</div>;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-6">Mis Tableros</h1>

      {/* Formulario para crear nuevo tablero */}
      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 flex-1"
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Nombre del nuevo tablero"
          onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
        />
        <button
          className="bg-blue-500 text-white px-4"
          onClick={handleCreateBoard}
        >
          Crear
        </button>
      </div>

      {/* Lista de tableros */}
      <div className="grid grid-cols-1 gap-3">
        {boards.map((board) => (
          <div
            key={board.id}
            className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Link to={`/boards/${board.id}`} className="flex-1">
              <h2 className="text-lg font-semibold">{board.name}</h2>
              <p className="text-sm text-gray-500">
                {board.taskCount} tareas
              </p>
            </Link>

            <button
              onClick={() => {
                const confirmed = confirm(`¿Eliminar el tablero "${board.name}"?`);
                if (confirmed) {
                  deleteBoard(board.id);
                }
              }}
              className="text-red-500 hover:text-red-700 px-2"
              title="Eliminar tablero"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardListPage;
