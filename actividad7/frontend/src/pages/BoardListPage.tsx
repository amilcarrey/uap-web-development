import { Link } from 'react-router-dom';
import { useBoards } from '../hooks/useBoards';
import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { toast } from 'react-hot-toast';



const BoardListPage = () => {
  const [newBoardName, setNewBoardName] = useState('');
  const { boards, isLoading, error, createBoard, deleteBoard } = useBoards();
  
  const { 
    refetchInterval,
    setRefetchInterval,
    uppercaseDescriptions,
    setUppercaseDescriptions 
  } = useSettings();
  const intervalOptions = [5, 10, 30, 60];

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard(newBoardName.trim());
      setNewBoardName('');
    }
  };

  const handleIntervalChange = (seconds: number) => {
    setRefetchInterval(seconds * 1000);
    toast.success(`Intervalo actualizado a ${seconds}s`);
  };

  const handleUppercaseToggle = () => {
    setUppercaseDescriptions(!uppercaseDescriptions);
    toast.success(uppercaseDescriptions ? 'Texto en minúsculas' : 'Texto en MAYÚSCULAS');
  };

  if (isLoading) return <div>Cargando tableros...</div>;
  if (error) return <div>Error al cargar tableros: {error.message}</div>;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      {/* Header con título y botones de configuración */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Tableros</h1>
        
        <div className="flex gap-2">
          {/* Botón de mayúsculas */}
          <button
            onClick={handleUppercaseToggle}
            className={`px-3 py-1 text-sm rounded ${
              uppercaseDescriptions ? 'bg-purple-500 text-white' : 'bg-gray-200'
            }`}
          >
            {uppercaseDescriptions ? 'MAYÚSCULAS' : 'minúsculas'}
          </button>

          {/* Selector de intervalo */}
          <select
            value={refetchInterval / 1000}
            onChange={(e) => handleIntervalChange(Number(e.target.value))}
            className="border px-2 py-1 rounded text-sm"
          >
            {intervalOptions.map((option) => (
              <option key={option} value={option}>
                {option}s
              </option>
            ))}
          </select>
        </div>
      </div>

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
                if (confirmed) deleteBoard(board.id);
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