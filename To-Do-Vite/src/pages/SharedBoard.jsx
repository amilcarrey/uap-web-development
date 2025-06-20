import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedBoard, getSharedBoardTasks } from '../config/api';
import { useToast } from '../context/ToastContext';
import PageLayout from '../components/PageLayout';

const SharedBoard = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSharedBoard = async () => {
      try {
        setIsLoading(true);
        const [boardData, tasksData] = await Promise.all([
          getSharedBoard(token),
          getSharedBoardTasks(token)
        ]);
        setBoard(boardData);
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
        addToast('Error al cargar el tablero compartido', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedBoard();
  }, [token, addToast]);

  if (isLoading) {
    return (
      <PageLayout title="Cargando...">
        <div className="text-white text-xl text-center">Cargando tablero compartido...</div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Error">
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Enlace no válido</h3>
          <p className="mb-4">El enlace que intentaste acceder no es válido o ha expirado.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </PageLayout>
    );
  }

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <PageLayout title={`${board.name} (Compartido)`}>
      <div className="mb-6">
        <div className="bg-blue-500/20 border border-blue-500 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📋 Tablero Compartido</h3>
          <p className="text-blue-200">
            Este es un tablero compartido de solo lectura. No puedes hacer cambios.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-white">{board.name}</h2>
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {board.category}
          </span>
          <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
            Solo lectura
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/30">
            <h3 className="text-lg font-semibold text-white mb-2">Total</h3>
            <p className="text-3xl font-bold text-white">{tasks.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/30">
            <h3 className="text-lg font-semibold text-white mb-2">Pendientes</h3>
            <p className="text-3xl font-bold text-yellow-400">{pendingTasks.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/30">
            <h3 className="text-lg font-semibold text-white mb-2">Completadas</h3>
            <p className="text-3xl font-bold text-green-400">{completedTasks.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tareas Pendientes */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Tareas Pendientes ({pendingTasks.length})
          </h3>
          {pendingTasks.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/30 text-center">
              <p className="text-white/60">No hay tareas pendientes</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-yellow-400 flex-shrink-0"></div>
                    <span className="text-white flex-1">{task.text}</span>
                    <span className="text-white/40 text-sm">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tareas Completadas */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Tareas Completadas ({completedTasks.length})
          </h3>
          {completedTasks.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/30 text-center">
              <p className="text-white/60">No hay tareas completadas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {completedTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/30 opacity-75"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white line-through flex-1">{task.text}</span>
                    <span className="text-white/40 text-sm">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </PageLayout>
  );
};

export default SharedBoard; 