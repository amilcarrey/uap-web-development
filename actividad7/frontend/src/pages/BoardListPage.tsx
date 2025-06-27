import { Link } from 'react-router-dom';
import { useBoards } from '../hooks/useBoards';
import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const BoardListPage = () => {
  const [newBoardName, setNewBoardName] = useState('');
  const { boards, isLoading, error, createBoard, deleteBoard } = useBoards();
  const { uppercaseDescriptions, setUppercaseDescriptions, refetchInterval, setRefetchInterval } = useSettings();

  const handleCreateBoard = () => {
    if (newBoardName.trim()) createBoard(newBoardName.trim());
    setNewBoardName('');
  };

  if (isLoading) return <div className="text-center py-8">Cargando tableros...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center"
      style={{ 
        backgroundImage: "url('/trabajo_oficina.jpg')",
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(0,0,0,0.3)"
      }}
    >
      {/* Header azul */}
      <div className="bg-blue-600 w-full py-8 mb-12 shadow-md">
        <h1 className="text-4xl font-bold text-white text-center">GESTOR DE TAREAS</h1>
      </div>

      {/* Contenedor principal (formulario + boards) */}
      <div className="container mx-auto px-4">
        {/* Nueva sección del formulario CENTRADO */}
        <div className="flex justify-center mb-8">
          <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-2xl">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Formulario centrado */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-center mb-6">Crear nuevo tablero</h2>
                <div className="flex flex-col items-center gap-4">
                  <input
                    className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-300 text-center text-lg"
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="Escribe el nombre del tablero"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg transition-colors"
                    onClick={handleCreateBoard}
                  >
                    Crear Tablero
                  </button>
                </div>
              </div>

              {/* Controles (derecha) - Se mantienen igual pero con mejor espaciado */}
              <div className="bg-gray-50 p-6 rounded-lg w-full md:w-64">
                <h2 className="text-xl font-semibold mb-4 text-center">Configuración</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Mayúsculas</label>
                    <button
                      onClick={() => setUppercaseDescriptions(!uppercaseDescriptions)}
                      className={`w-full py-3 rounded-lg ${
                        uppercaseDescriptions 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-200'
                      }`}
                    >
                      {uppercaseDescriptions ? 'ACTIVADO' : 'desactivado'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Actualización (seg)</label>
                    <select
                      value={refetchInterval / 1000}
                      onChange={(e) => setRefetchInterval(Number(e.target.value) * 1000)}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="5">5 segundos</option>
                      <option value="10">10 segundos</option>
                      <option value="30">30 segundos</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de boards (se mantiene igual) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div 
              key={board.id} 
              className="bg-white bg-opacity-90 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <Link to={`/boards/${board.id}`} className="block mb-2">
                <h3 className="text-lg font-semibold text-blue-600">{board.name}</h3>
              
              </Link>
              <button
                onClick={() => confirm(`¿Eliminar ${board.name}?`) && deleteBoard(board.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardListPage;